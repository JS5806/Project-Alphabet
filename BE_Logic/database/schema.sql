-- 식당 테이블
CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 한식, 중식, 일식, 양식 등
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 카테고리별 검색 성능 향상을 위한 인덱스
CREATE INDEX idx_restaurants_category ON restaurants(category);

-- 방문 기록 테이블
CREATE TABLE IF NOT EXISTS visit_history (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- 최근 방문 조회 성능 향상을 위한 인덱스
CREATE INDEX idx_history_user_date ON visit_history(user_id, visit_date);

-- (테스트용) 더미 데이터 삽입 예시
-- INSERT INTO restaurants (name, category) VALUES ('김밥천국', '한식'), ('홍콩반점', '중식'), ('스시로', '일식');