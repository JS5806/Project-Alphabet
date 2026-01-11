const { Op, Sequelize } = require('sequelize');
const { Restaurant, Menu, EatHistory } = require('../models');
const redisClient = require('../config/redis');

// Haversine 공식을 이용한 거리 계산 SQL 리터럴 생성 함수
const getDistanceAttribute = (lat, lng) => {
  return Sequelize.literal(
    `6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude)))`
  );
};

exports.recommendMenu = async (req, res) => {
  try {
    const { userId, latitude, longitude, category, maxDistance = 2, excludeDays = 7 } = req.query;

    if (!userId || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing required parameters: userId, latitude, longitude' });
    }

    // 1. [Redis & DB] 최근 섭취 메뉴 조회 (중복 메뉴 필터링)
    // Redis Key 전략: history:userId
    // 데이터가 매우 많을 경우 DB 부하를 줄이기 위해 Redis를 캐시로 사용
    const redisKey = `history:${userId}`;
    let eatenMenus = [];
    
    const cachedHistory = await redisClient.get(redisKey);
    
    if (cachedHistory) {
      eatenMenus = JSON.parse(cachedHistory);
    } else {
      // Redis Miss -> DB 조회
      // [Team Comment] 최적화: idx_user_date 인덱스를 사용하여 최근 N일 데이터만 빠르게 조회
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(excludeDays));

      const histories = await EatHistory.findAll({
        attributes: ['menu_name'],
        where: {
          user_id: userId,
          eaten_at: {
            [Op.gte]: cutoffDate // 최근 N일 이내
          }
        },
        raw: true
      });
      
      eatenMenus = histories.map(h => h.menu_name);
      
      // Redis에 캐싱 (예: 10분간 유효, 잦은 요청 시 DB 보호)
      await redisClient.setEx(redisKey, 600, JSON.stringify(eatenMenus));
    }

    // 2. [DB] 조건에 맞는 레스토랑 및 메뉴 탐색
    // 공간 인덱스(Spatial Index)를 쓰거나 Haversine 공식을 사용. 여기서는 Haversine 사용.
    const whereConditions = {};
    if (category) {
      whereConditions.category = category;
    }

    // MySQL Having 절을 사용하여 거리 필터링
    const restaurants = await Restaurant.findAll({
      attributes: {
        include: [
          [getDistanceAttribute(latitude, longitude), 'distance']
        ]
      },
      where: whereConditions,
      having: Sequelize.where(Sequelize.col('distance'), '<=', maxDistance), // km 단위
      include: [{
        model: Menu,
        required: true, // 메뉴가 있는 식당만
        where: {
          name: {
            [Op.notIn]: eatenMenus // [Core Logic] 섭취한 메뉴 제외
          }
        }
      }],
      order: sequelize.random() // 랜덤 정렬
    });

    if (restaurants.length === 0) {
      return res.status(404).json({ message: 'No suitable menus found within conditions.' });
    }

    // 3. [Logic] 랜덤 선택
    // Restaurant 단위로 랜덤이 되었으나, 메뉴 단위로 평탄화하여 하나를 선택
    const allCandidateMenus = [];
    restaurants.forEach(rest => {
      rest.Menus.forEach(menu => {
        allCandidateMenus.push({
          restaurantName: rest.name,
          category: rest.category,
          menuName: menu.name,
          price: menu.price,
          distance: parseFloat(rest.dataValues.distance).toFixed(2) + ' km'
        });
      });
    });

    if (allCandidateMenus.length === 0) {
        return res.status(404).json({ message: 'Filtered all menus based on history.' });
    }

    // 최종 랜덤 1개 선택
    const randomPick = allCandidateMenus[Math.floor(Math.random() * allCandidateMenus.length)];

    res.status(200).json({
      success: true,
      data: randomPick
    });

  } catch (error) {
    console.error('Recommendation Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};