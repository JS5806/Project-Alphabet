const { Pool } = require('pg');

// [Team Comment 반영] 투표 마감 직전 트래픽 몰림 대비 Connection Pool 최적화
// AWS RDS t3.medium 기준, 너무 많은 연결은 컨텍스트 스위칭 오버헤드 발생.
// 적절한 max connection 설정 및 idle timeout 설정 필수.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  
  // Connection Pool 설정
  max: 20, // 동시 처리량이 많을 경우 PgBouncer 도입 고려, Node 프로세스 당 적정 수 유지
  idleTimeoutMillis: 30000, // 유휴 연결 30초 후 종료
  connectionTimeoutMillis: 2000, // 연결 시도 2초 초과 시 타임아웃 (Fail Fast)
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;