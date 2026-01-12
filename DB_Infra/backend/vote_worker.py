import os
import json
import time
import redis
import psycopg2
from psycopg2.extras import execute_values

# [Team Comment 반영]
# 실시간 투표 집계 시 DB I/O 부하 최소화를 위한 Redis Write-Back 전략 구현
# Redis List를 버퍼로 사용하며, 일정 개수(BATCH_SIZE)나 시간(BATCH_INTERVAL)마다 DB로 Bulk Insert 수행

# Configuration
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "mvp_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "password")

VOTE_QUEUE_KEY = "vote_write_back_queue"
BATCH_SIZE = 100
BATCH_INTERVAL = 5  # seconds

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )

def process_votes():
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    print("Vote Worker Started...")

    while True:
        # 1. Redis 큐에서 데이터 확인
        queue_len = r.llen(VOTE_QUEUE_KEY)
        
        if queue_len >= BATCH_SIZE:
            # 배치 크기 도달 시 즉시 처리
            flush_to_db(r, BATCH_SIZE)
        elif queue_len > 0:
            # 데이터는 있지만 배치 크기 미달 시, 일정 시간 대기 후 처리 (여기선 단순화하여 즉시 처리 로직으로 구현 가능하나, 효율을 위해 Sleep)
            time.sleep(BATCH_INTERVAL)
            flush_to_db(r, queue_len)
        else:
            time.sleep(1)

def flush_to_db(redis_client, count):
    # Redis에서 데이터 Pop
    # Pipeline을 사용하여 원자적으로 데이터 가져오기 (여기서는 단순 range/lpop 사용)
    # 실제 프로덕션에서는 RPOP과 트랜잭션 보장이 중요함
    
    votes_to_insert = []
    
    # count 만큼 꺼내기
    for _ in range(count):
        data = redis_client.lpop(VOTE_QUEUE_KEY)
        if data:
            try:
                vote_data = json.loads(data)
                votes_to_insert.append((vote_data['user_id'], vote_data['restaurant_id'], vote_data['voted_at']))
            except json.JSONDecodeError:
                print(f"Skipping invalid JSON: {data}")

    if not votes_to_insert:
        return

    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 2. DB Bulk Insert (Transaction 관리)
        insert_query = """
            INSERT INTO votes (user_id, restaurant_id, voted_at)
            VALUES %s
        """
        execute_values(cur, insert_query, votes_to_insert)
        
        conn.commit()
        print(f"Successfully flushed {len(votes_to_insert)} votes to DB.")

    except Exception as e:
        print(f"Error flushing to DB: {e}")
        if conn:
            conn.rollback()
        # 실패한 데이터를 다시 Redis Queue에 넣거나 Dead Letter Queue로 보내는 로직 필요
        # MVP 단계에서는 로그만 남김
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    # DB 연결 대기 (Docker Compose startup order 이슈 방지)
    time.sleep(10) 
    process_votes()

# [참고: API 서버에서 Redis로 투표를 넣는 로직 예시]
# r.incr(f"restaurant:votes:{restaurant_id}")  <- 실시간 조회용 카운터 (즉시 반영)
# r.rpush("vote_write_back_queue", json.dumps({...})) <- DB 저장용 큐 (비동기 처리)