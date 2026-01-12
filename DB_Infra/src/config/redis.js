const Redis = require('ioredis');

// [4] Redis 설정: 고속 데이터 조회 및 랭킹 시스템
// Cluster 모드 또는 AWS ElastiCache 엔드포인트 사용
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  
  // 재연결 전략
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
});

redis.on('connect', () => console.log('Redis Connected'));
redis.on('error', (err) => console.error('Redis Error:', err));

module.exports = redis;