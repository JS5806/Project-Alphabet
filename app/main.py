import os
import random
import json
from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine, text
from redis import Redis
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

app = FastAPI()

# Database Setup
DB_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/lunchdb")
engine = create_engine(DB_URL)

# Redis Setup
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
redis_client = Redis.from_url(REDIS_URL, decode_responses=True)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/recommend/{category}")
def recommend_menu(category: str):
    """
    [설계 1] 랜덤 추천 알고리즘 DB 최적화 및 Redis 캐싱
    """
    cache_key = f"recommendation:{category}"
    
    # 1. Redis 캐시 확인 (부하 분산)
    cached_menu = redis_client.get(cache_key)
    if cached_menu:
        return {"source": "cache", "menu": json.loads(cached_menu)}

    with engine.connect() as conn:
        # 2. [Team Comment 반영] ID 기반 샘플링 방식 (ORDER BY RAND() 대체)
        # 방식: 해당 카테고리의 Min ID와 Max ID를 구한 뒤 랜덤 오프셋을 적용하여 조회
        # 데이터가 많을수록 ORDER BY RANDOM()보다 훨씬 효율적임.
        
        # 2-1. ID 범위 조회
        range_query = text("SELECT MIN(id), MAX(id) FROM menus WHERE category = :category")
        min_id, max_id = conn.execute(range_query, {"category": category}).fetchone()

        if not min_id:
            raise HTTPException(status_code=404, detail="No menus found in this category")

        # 2-2. 랜덤 ID 생성 및 Gap 처리 (삭제된 ID가 있을 수 있으므로 >= 연산 사용)
        random_id = random.randint(min_id, max_id)
        
        # 2-3. 인덱스를 활용한 랜덤 조회 (LIMIT 1로 스캔 최소화)
        sql = text("""
            SELECT id, name, category, price 
            FROM menus 
            WHERE id >= :random_id AND category = :category 
            ORDER BY id ASC 
            LIMIT 1
        """)
        
        result = conn.execute(sql, {"random_id": random_id, "category": category}).fetchone()
        
        # 만약 random_id보다 큰 ID가 없다면(범위 끝부분), 다시 처음부터 조회
        if not result:
            result = conn.execute(sql, {"random_id": min_id, "category": category}).fetchone()

        menu_data = {
            "id": result[0],
            "name": result[1],
            "category": result[2],
            "price": result[3]
        }

        # 3. Redis 캐싱 적용 (TTL 10분)
        # 같은 카테고리 요청 폭주 시 DB 보호
        redis_client.setex(cache_key, 600, json.dumps(menu_data))

        return {"source": "database", "menu": menu_data}