import os
import json
import asyncio
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import redis.asyncio as redis
import asyncpg
from contextlib import asynccontextmanager

# 환경 변수 로드
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/voting_db")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")

# Redis Key Constants
VOTE_QUEUE_KEY = "vote_queue"
RESTAURANT_SCORE_KEY = "restaurant:{}:score"
USER_VOTE_KEY = "user:{}:voted_restaurants"

app_state = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: 연결 설정
    app_state['redis'] = redis.from_url(REDIS_URL, decode_responses=True)
    app_state['db_pool'] = await asyncpg.create_pool(DATABASE_URL)
    
    # 백그라운드 DB 동기화 태스크 시작 (간소화를 위해 루프 태스크로 가정)
    sync_task = asyncio.create_task(background_db_sync())
    
    yield
    
    # Shutdown: 연결 종료
    sync_task.cancel()
    await app_state['redis'].close()
    await app_state['db_pool'].close()

app = FastAPI(lifespan=lifespan)

class VoteRequest(BaseModel):
    user_id: int
    restaurant_id: int

async def background_db_sync():
    """
    Write-back 구현: Redis 큐에 쌓인 투표 데이터를 주기적으로 DB에 일괄 저장
    """
    while True:
        try:
            await asyncio.sleep(5)  # 5초마다 동기화
            r = app_state['redis']
            pool = app_state['db_pool']

            # 큐에서 데이터 가져오기 (배치 처리 가능)
            # 여기서는 단순화를 위해 한 번에 최대 100개씩 처리한다고 가정
            vote_data_list = []
            for _ in range(100):
                data = await r.lpop(VOTE_QUEUE_KEY)
                if not data:
                    break
                vote_data_list.append(json.loads(data))
            
            if vote_data_list:
                async with pool.acquire() as conn:
                    # 일괄 Insert (Bulk Insert)
                    await conn.executemany('''
                        INSERT INTO votes (user_id, restaurant_id) 
                        VALUES ($1, $2)
                        ON CONFLICT (user_id, restaurant_id) DO NOTHING
                    ''', [(v['user_id'], v['restaurant_id']) for v in vote_data_list])
                print(f"Synced {len(vote_data_list)} votes to DB.")

        except Exception as e:
            print(f"Sync Error: {e}")

@app.post("/vote")
async def vote(vote_req: VoteRequest):
    r = app_state['redis']
    
    # 1. 중복 투표 방지 (Redis Set 활용 - 고속 조회)
    user_key = USER_VOTE_KEY.format(vote_req.user_id)
    if await r.sismember(user_key, vote_req.restaurant_id):
        raise HTTPException(status_code=400, detail="Already voted for this restaurant")

    # 2. Redis Atomic Operation으로 점수 증가
    score_key = RESTAURANT_SCORE_KEY.format(vote_req.restaurant_id)
    new_score = await r.incr(score_key)
    
    # 3. 사용자 투표 기록 캐싱
    await r.sadd(user_key, vote_req.restaurant_id)
    
    # 4. DB 쓰기 지연을 위한 큐 적재 (Write-back)
    vote_event = {
        "user_id": vote_req.user_id, 
        "restaurant_id": vote_req.restaurant_id
    }
    await r.rpush(VOTE_QUEUE_KEY, json.dumps(vote_event))

    return {"status": "success", "current_score": new_score}

@app.get("/restaurant/{restaurant_id}/score")
async def get_score(restaurant_id: int):
    r = app_state['redis']
    score = await r.get(RESTAURANT_SCORE_KEY.format(restaurant_id))
    return {"restaurant_id": restaurant_id, "score": int(score) if score else 0}