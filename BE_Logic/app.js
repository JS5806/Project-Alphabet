const express = require('express');
const { pgPool, redisClient, connectDB } = require('./config/db');

const app = express();
app.use(express.json());

// 서버 시작 시 DB 연결
connectDB();

const PORT = process.env.PORT || 3000;

/**
 * [Main Function] 랜덤 맛집 추천 API
 * Method: POST
 * Body: { "userId": 1, "category": "한식", "excludeDays": 7 }
 */
app.post('/api/recommend', async (req, res) => {
    const { userId, category, excludeDays = 7 } = req.body;

    if (!userId || !category) {
        return res.status(400).json({ error: 'userId and category are required.' });
    }

    try {
        // ---------------------------------------------------------
        // 1. 후보군 조회 (Redis Caching + ID 기반 인덱싱 전략)
        // ---------------------------------------------------------
        // 팀 코멘트 반영: ORDER BY RAND() 대신 ID 목록을 가져와서 앱단에서 랜덤 처리
        // Redis Key 설계: restaurants:ids:{category}
        
        const redisKey = `restaurants:ids:${category}`;
        let candidateIds = [];

        // 캐시 확인
        const cachedIds = await redisClient.get(redisKey);

        if (cachedIds) {
            candidateIds = JSON.parse(cachedIds);
        } else {
            // 캐시 미스: DB에서 해당 카테고리의 모든 ID 조회
            const query = 'SELECT id FROM restaurants WHERE category = $1';
            const result = await pgPool.query(query, [category]);
            
            candidateIds = result.rows.map(row => row.id);

            // 데이터가 하나도 없는 경우 처리
            if (candidateIds.length === 0) {
                return res.status(404).json({ message: '해당 카테고리의 식당이 존재하지 않습니다.' });
            }

            // Redis에 캐싱 (TTL 1시간 설정: 데이터 변경 빈도에 따라 조정)
            await redisClient.set(redisKey, JSON.stringify(candidateIds), { EX: 3600 });
        }

        // ---------------------------------------------------------
        // 2. 최근 방문 제외 로직 (최근 N일 이내)
        // ---------------------------------------------------------
        // 최근 N일간 방문한 식당 ID 목록 조회
        const historyQuery = `
            SELECT restaurant_id 
            FROM visit_history 
            WHERE user_id = $1 
            AND visit_date >= NOW() - INTERVAL '${parseInt(excludeDays)} days'
        `;
        const historyResult = await pgPool.query(historyQuery, [userId]);
        const visitedIds = new Set(historyResult.rows.map(row => row.restaurant_id));

        // 후보군에서 방문한 ID 필터링
        // Set을 사용하여 조회 성능 O(1) 유지
        let finalCandidates = candidateIds.filter(id => !visitedIds.has(id));
        let isFallback = false;

        // ---------------------------------------------------------
        // 3. Fallback 로직 (추천 가능한 식당이 0개일 경우)
        // ---------------------------------------------------------
        if (finalCandidates.length === 0) {
            console.warn(`User ${userId}: No restaurants available after filtering. Activating Fallback.`);
            // 대체 로직: 방문 기록을 무시하고 전체 후보군 중에서 선택
            finalCandidates = candidateIds;
            isFallback = true;
        }

        // ---------------------------------------------------------
        // 4. 랜덤 선택 (ID 기반 랜덤 인덱싱)
        // ---------------------------------------------------------
        const randomIndex = Math.floor(Math.random() * finalCandidates.length);
        const selectedId = finalCandidates[randomIndex];

        // ---------------------------------------------------------
        // 5. 최종 식당 상세 정보 조회
        // ---------------------------------------------------------
        const detailQuery = 'SELECT * FROM restaurants WHERE id = $1';
        const detailResult = await pgPool.query(detailQuery, [selectedId]);
        const restaurant = detailResult.rows[0];

        // 응답 반환
        return res.status(200).json({
            success: true,
            data: restaurant,
            meta: {
                total_candidates: candidateIds.length,
                filtered_candidates: isFallback ? 0 : finalCandidates.length,
                is_fallback_applied: isFallback, // Fallback 적용 여부 클라이언트에 고지
                message: isFallback 
                    ? '최근 방문하지 않은 식당이 없어, 전체 목록 중 추천되었습니다.' 
                    : '최근 방문 기록을 제외한 추천 결과입니다.'
            }
        });

    } catch (error) {
        console.error('Recommendation Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * [Helper API] 방문 기록 저장 (테스트용)
 */
app.post('/api/visit', async (req, res) => {
    const { userId, restaurantId } = req.body;
    try {
        await pgPool.query(
            'INSERT INTO visit_history (user_id, restaurant_id) VALUES ($1, $2)', 
            [userId, restaurantId]
        );
        res.json({ success: true, message: 'Visit recorded' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});