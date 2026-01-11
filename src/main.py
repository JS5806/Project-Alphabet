import os
import random
import time
import psycopg2
import redis
from datetime import datetime, timedelta

# [Configuration]
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_NAME = os.getenv('DB_NAME', 'lunch_rec')
DB_USER = os.getenv('DB_USER', 'admin')
DB_PASS = os.getenv('DB_PASS', 'password')
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')

# [Connection Factory]
def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS
    )

def get_redis_client():
    return redis.Redis(host=REDIS_HOST, port=6379, db=0, decode_responses=True)

class LunchRecommender:
    def __init__(self):
        self.redis = get_redis_client()
        self.CACHE_KEY_MENUS = "all_menu_ids"
        self.CACHE_TTL = 3600  # 1 hour

    def _warm_up_cache(self):
        """
        [Optimization 1] 메타데이터(메뉴 ID) 캐싱
        DB I/O를 줄이기 위해 전체 메뉴 ID 리스트를 Redis에 적재합니다.
        ORDER BY RAND() 대신 애플리케이션 레벨에서 랜덤 추출을 수행하기 위함입니다.
        """
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id FROM menus")
        menu_ids = [str(row[0]) for row in cur.fetchall()]
        cur.close()
        conn.close()

        if menu_ids:
            # Redis Set에 저장 (중복 방지 및 빠른 조회)
            self.redis.delete(self.CACHE_KEY_MENUS)
            self.redis.sadd(self.CACHE_KEY_MENUS, *menu_ids)
            self.redis.expire(self.CACHE_KEY_MENUS, self.CACHE_TTL)
            print(f"[Cache] Warmed up with {len(menu_ids)} menus.")
        
        return set(menu_ids)

    def get_all_menu_ids(self):
        """Redis에서 전체 메뉴 ID 조회, 없으면 DB 조회 후 캐싱 (Cache-Aside Pattern)"""
        menu_ids = self.redis.smembers(self.CACHE_KEY_MENUS)
        if not menu_ids:
            print("[Cache] Miss. Fetching from DB...")
            return self._warm_up_cache()
        return menu_ids

    def get_user_history(self, user_id, days=7):
        """
        [Optimization 2 & 3] 중복 방지 및 인덱스 활용
        복합 인덱스 (user_id, created_at)을 활용하여 최근 N일간 먹은 메뉴 ID만 빠르게 조회합니다.
        NOT IN 서브쿼리를 DB에서 수행하는 것보다, ID만 가져와서 애플리케이션에서 필터링하는 것이 확장성에 유리합니다.
        """
        conn = get_db_connection()
        cur = conn.cursor()
        
        query = """
            SELECT menu_id 
            FROM meal_history 
            WHERE user_id = %s 
              AND created_at >= NOW() - INTERVAL '%s days'
        """
        cur.execute(query, (user_id, days))
        history_ids = {str(row[0]) for row in cur.fetchall()}
        
        cur.close()
        conn.close()
        return history_ids

    def recommend_menu(self, user_id, filter_days=3):
        """
        [Core Logic] 추천 알고리즘
        1. Redis에서 전체 후보군 확보
        2. DB에서 제외 대상(최근 먹은 것) 확보
        3. Set Difference 연산으로 후보군 도출
        4. Random Choice 후 상세 정보 DB 조회 (PK Lookup = 매우 빠름)
        """
        all_menus = self.get_all_menu_ids()
        eaten_menus = self.get_user_history(user_id, days=filter_days)

        # Python Set 연산을 통한 필터링 (DB 부하 감소)
        candidates = list(all_menus - eaten_menus)

        if not candidates:
            print(f"[Info] User {user_id} ate everything in {filter_days} days. Resetting candidates.")
            candidates = list(all_menus)

        # Random Pick
        picked_id = random.choice(candidates)

        # 상세 정보 조회
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, name, category FROM menus WHERE id = %s", (picked_id,))
        menu = cur.fetchone()
        cur.close()
        conn.close()

        return {"id": menu[0], "name": menu[1], "category": menu[2]}

    def log_meal(self, user_id, menu_id):
        """사용자 선택 로깅"""
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO meal_history (user_id, menu_id) VALUES (%s, %s)",
            (user_id, menu_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        print(f"[Log] User {user_id} chose Menu ID {menu_id}")

# [Main Execution Flow]
if __name__ == "__main__":
    # DB 컨테이너가 뜰 때까지 잠시 대기 (실제 운영 환경에서는 healthcheck 사용 권장)
    time.sleep(5) 
    
    recommender = LunchRecommender()
    
    USER_ID = 1
    
    print("--- [Simulation Start] ---")
    
    # 1. 초기 추천
    print(f"\n1. Recommending for User {USER_ID}...")
    menu = recommender.recommend_menu(USER_ID, filter_days=3)
    print(f"-> Recommended: {menu['name']} ({menu['category']})")
    
    # 2. 식사 기록 저장
    recommender.log_meal(USER_ID, menu['id'])
    
    # 3. 연속 추천 시뮬레이션 (중복 방지 확인)
    print(f"\n2. Recommending again (excluding recently eaten)...")
    for _ in range(3):
        menu = recommender.recommend_menu(USER_ID, filter_days=3)
        print(f"-> Recommended: {menu['name']} ({menu['category']})")
        recommender.log_meal(USER_ID, menu['id'])
        time.sleep(0.1)

    print("\n--- [Simulation End] ---")