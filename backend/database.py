import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# [Team Comment 반영]: 점심시간 트래픽 대응을 위한 Connection Pool 튜닝
# pool_size: 기본 연결 수 유지 (20)
# max_overflow: 트래픽 폭주 시 허용할 추가 연결 수 (10)
# pool_recycle: 연결 끊김 방지를 위한 주기적 재연결 (3600초)
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
POSTGRES_DB = os.getenv("POSTGRES_DB", "lunch_voting")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "db")

SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=20,       
    max_overflow=10,    
    pool_timeout=30,    
    pool_recycle=1800,
    pool_pre_ping=True  # 연결 유효성 체크
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()