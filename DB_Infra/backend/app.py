import os
import random
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.expression import func
from apscheduler.schedulers.background import BackgroundScheduler
import redis
import logging

# [Configuration]
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///local.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# [DB & Cache Connection]
db = SQLAlchemy(app)
redis_client = redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/0'))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MenuApp")

# [Models]
class Menu(db.Model):
    __tablename__ = 'menus'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False, index=True) # Indexing applied in DB

class VoteSession(db.Model):
    __tablename__ = 'vote_sessions'
    id = db.Column(db.Integer, primary_key=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)

class Vote(db.Model):
    __tablename__ = 'votes'
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('vote_sessions.id'))
    menu_id = db.Column(db.Integer, db.ForeignKey('menus.id'))

# [Main Function 1: Random Recommendation]
# DB의 Random 함수를 사용하되, Query Builder를 통해 SQL Injection 방지
@app.route('/api/recommend', methods=['GET'])
def recommend_menu():
    category = request.args.get('category')
    
    query = Menu.query
    if category:
        # category 컬럼에 인덱스가 걸려있어 필터링 속도 최적화됨
        query = query.filter_by(category=category.upper())
    
    # ORDER BY RAND()는 데이터가 수백만 건일 경우 성능 이슈가 있으나, 
    # 메뉴 데이터 특성상(수백 건 이내) 효율적임. 대용량일 경우 ID Range 스캔 방식 권장.
    menu = query.order_by(func.random()).first()
    
    if not menu:
        return jsonify({"error": "No menu found"}), 404
        
    return jsonify({
        "id": menu.id,
        "name": menu.name,
        "category": menu.category
    })

# [Main Function 4: Vote Reset & Transaction Management]
# 트랜잭션을 보장하여 기존 세션 종료 및 신규 세션 생성을 원자적(Atomic)으로 처리
@app.route('/api/vote/reset', methods=['POST'])
def reset_vote_session():
    duration_minutes = request.json.get('duration', 30)
    
    try:
        # 트랜잭션 시작
        with db.session.begin():
            # 1. 기존 활성 세션 모두 종료
            VoteSession.query.filter_by(is_active=True).update({'is_active': False})
            
            # 2. (선택사항) 기존 투표 데이터 정리 (Truncate는 DDL이라 롤백 불가하므로 Delete 사용)
            # 실제 운영에서는 Audit을 위해 데이터를 남기고 세션 ID만 분리하는 것이 좋으나
            # 요구사항의 '초기화'를 위해 현재 세션과 연관된 투표를 삭제하는 로직 예시
            # db.session.query(Vote).delete() # 전체 삭제가 필요할 경우
            
            # 3. 신규 세션 생성
            new_session = VoteSession(
                is_active=True,
                expires_at=datetime.utcnow() + timedelta(minutes=duration_minutes)
            )
            db.session.add(new_session)
            
        # commit은 context manager(with)가 종료될 때 자동 수행
        logger.info("Vote session reset successfully.")
        return jsonify({"message": "New vote session started", "expires_in_minutes": duration_minutes}), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Transaction failed: {e}")
        return jsonify({"error": "Failed to reset session"}), 500

# [Main Function 3: Scheduled Task for Timer]
def check_expired_sessions():
    """
    백그라운드에서 주기적으로 마감 시간이 지난 세션을 찾아 종료 처리
    """
    with app.app_context():
        now = datetime.utcnow()
        # Redis Lock을 사용하여 다중 컨테이너 환경에서 중복 실행 방지 (DevOps Best Practice)
        lock = redis_client.lock("session_checker_lock", timeout=5)
        
        if lock.acquire(blocking=False):
            try:
                expired_sessions = VoteSession.query.filter(
                    VoteSession.is_active == True,
                    VoteSession.expires_at <= now
                ).all()
                
                if expired_sessions:
                    count = 0
                    for session in expired_sessions:
                        session.is_active = False
                        count += 1
                    db.session.commit()
                    logger.info(f"Closed {count} expired sessions.")
            finally:
                lock.release()

# 스케줄러 설정
scheduler = BackgroundScheduler()
scheduler.add_job(check_expired_sessions, 'interval', minutes=1)
scheduler.start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)