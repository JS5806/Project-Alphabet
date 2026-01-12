from fastapi import FastAPI, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import text
import redis
import os
import models
from database import engine, get_db
from pydantic import BaseModel

# DB 테이블 생성 (MVP 단계이므로 앱 시작 시 생성, 추후 Alembic 마이그레이션 도입 권장)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lunch Voting System")

# [1. Session Storage] Redis 연결 설정
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "redis"),
    port=6379,
    db=0,
    decode_responses=True
)

# Pydantic Schemas
class MenuCreate(BaseModel):
    name: str
    description: str = None

class VoteRequest(BaseModel):
    user_id: int
    menu_id: int

@app.get("/health")
def health_check():
    return {"status": "ok"}

# [2. 메뉴 CRUD]
@app.post("/menus/", status_code=status.HTTP_201_CREATED)
def create_menu(menu: MenuCreate, db: Session = Depends(get_db)):
    new_menu = models.Menu(name=menu.name, description=menu.description)
    db.add(new_menu)
    db.commit()
    db.refresh(new_menu)
    return new_menu

@app.get("/menus/")
def read_menus(db: Session = Depends(get_db)):
    # vote_count 내림차순 정렬 (인기순)
    return db.query(models.Menu).order_by(models.Menu.vote_count.desc()).all()

# [3. 실시간 투표 트랜잭션 처리] Row-level Locking 적용
@app.post("/votes/")
def cast_vote(vote_req: VoteRequest, db: Session = Depends(get_db)):
    # 트랜잭션 시작
    try:
        # 1. 사용자 확인 (Mocking)
        user = db.query(models.User).filter(models.User.id == vote_req.user_id).first()
        if not user:
            # 데모용 유저 자동 생성
            user = models.User(id=vote_req.user_id, username=f"user_{vote_req.user_id}", provider="LDAP")
            db.add(user)
            db.flush()

        # 2. 중복 투표 체크
        existing_vote = db.query(models.Vote).filter(
            models.Vote.user_id == vote_req.user_id,
            models.Vote.menu_id == vote_req.menu_id
        ).first()
        
        if existing_vote:
            raise HTTPException(status_code=400, detail="Already voted for this menu")

        # 3. 메뉴 Lock & Update (Concurrency Control 핵심)
        # with_for_update()는 'SELECT ... FOR UPDATE' 쿼리를 생성하여
        # 트랜잭션이 끝날 때까지 해당 메뉴 행(Row)을 잠금.
        menu = db.query(models.Menu).filter(models.Menu.id == vote_req.menu_id).with_for_update().first()
        
        if not menu:
            raise HTTPException(status_code=404, detail="Menu not found")

        # 4. 투표 기록 생성
        new_vote = models.Vote(user_id=user.id, menu_id=menu.id)
        db.add(new_vote)

        # 5. 집계 데이터 업데이트 (Atomic Increment)
        menu.vote_count += 1
        
        db.commit() # Lock 해제 시점
        
        return {"message": "Vote cast successfully", "current_count": menu.vote_count}

    except Exception as e:
        db.rollback()
        raise e

# [4. 집계 데이터 파이프라인] Redis Caching 활용 (Optional)
@app.get("/results/realtime")
def get_realtime_results(db: Session = Depends(get_db)):
    # MVP: DB 인덱스를 활용한 직접 조회 (트래픽 증가 시 Redis 캐싱 레이어 추가 권장)
    results = db.query(models.Menu.name, models.Menu.vote_count)\
        .order_by(models.Menu.vote_count.desc())\
        .limit(5).all()
    return [{"menu": r.name, "votes": r.vote_count} for r in results]