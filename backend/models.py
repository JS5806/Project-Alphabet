from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

# [1. 사내 인증 시스템 연동] 사용자 테이블
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    provider = Column(String) # LDAP, GOOGLE, etc.
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# [2. 메뉴 모델링] 정규화된 메뉴 테이블
class Menu(Base):
    __tablename__ = "menus"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    image_url = Column(String)
    # [4. 집계 데이터 최적화] 실시간 조회를 위한 반정규화 필드 (Transaction으로 무결성 보장)
    vote_count = Column(Integer, default=0) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# [3. 투표 트랜잭션] 투표 이력 테이블
class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    menu_id = Column(Integer, ForeignKey("menus.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 한 사용자는 하루/한 메뉴에 대해 중복 투표 방지 (여기선 단순화를 위해 유저당 메뉴 1회로 제한)
    __table_args__ = (
        UniqueConstraint('user_id', 'menu_id', name='unique_user_menu_vote'),
        Index('idx_vote_menu_id', 'menu_id'), # 집계 성능 최적화
    )