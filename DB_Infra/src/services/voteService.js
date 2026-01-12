const pool = require('../config/db');
const redis = require('../config/redis');

// [Main Functions 3 & 4] 투표 트랜잭션 및 실시간 집계
async function castVote(userId, restaurantId) {
  const client = await pool.connect();
  
  try {
    // 1. 트랜잭션 시작
    await client.query('BEGIN');

    // 2. DB에 투표 기록 (PostgreSQL)
    // UNIQUE 제약조건(uk_user_restaurant_vote)으로 인해 중복 투표 시 에러 발생 -> 동시성 제어
    const insertQuery = `
      INSERT INTO votes (user_id, restaurant_id)
      VALUES ($1, $2)
      RETURNING vote_id, voted_at
    `;
    const res = await client.query(insertQuery, [userId, restaurantId]);

    // 3. 트랜잭션 커밋
    await client.query('COMMIT');

    // 4. Redis 캐싱 업데이트 (실시간 집계 시스템)
    // DB 트랜잭션이 성공한 경우에만 Redis 카운터 증가 (데이터 일관성 유지)
    // Sorted Set(ZSET)을 사용하여 실시간 랭킹 구현: Key='restaurant_ranks', Score=투표수, Member=restaurant_id
    // increment 연산은 Atomic 하므로 Redis 레벨의 동시성 문제 해결
    await redis.zincrby('restaurant_ranks', 1, restaurantId);

    // 식당 상세 조회 캐시 무효화 또는 업데이트 (선택 사항)
    // await redis.del(`restaurant:${restaurantId}:details`);

    return res.rows[0];

  } catch (error) {
    await client.query('ROLLBACK');
    
    // 중복 키 에러 (Postgres code 23505) 처리
    if (error.code === '23505') {
      throw new Error('Already voted for this restaurant.');
    }
    throw error;
  } finally {
    client.release(); // Connection Pool 반환
  }
}

// [4] 실시간 랭킹 조회 (Redis 활용 고속 조회)
async function getRealtimeRanking(topN = 10) {
  // DB 부하 없이 Redis에서 즉시 반환
  // ZREVRANGE: 점수가 높은 순으로 조회
  const rankings = await redis.zrevrange('restaurant_ranks', 0, topN - 1, 'WITHSCORES');
  
  // Redis 결과 파싱 ['id1', 'score1', 'id2', 'score2'...] -> [{id: id1, score: score1}...]
  const result = [];
  for (let i = 0; i < rankings.length; i += 2) {
    result.push({
      restaurantId: rankings[i],
      votes: parseInt(rankings[i + 1], 10)
    });
  }
  return result;
}

module.exports = { castVote, getRealtimeRanking };