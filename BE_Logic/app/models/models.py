from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import date

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)

class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    location = Column(String, nullable=True)
    category = Column(String, nullable=True) # 한식, 중식, 일식 등
    menu_items = Column(String, nullable=True) # JSON or Text description

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    date = Column(Date, default=date.today, nullable=False)

    # Team Comment 반영: 동시성 이슈 및 1일 1회 제한을 위한 복합 유니크 제약조건
    __table_args__ = (
        UniqueConstraint('user_id', 'date', name='uq_user_date_vote'),
    )