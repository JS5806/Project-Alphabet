-- 1. 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 식당 테이블
-- current_score는 Redis와 주기적 동기화되거나, 집계 쿼리 캐싱용으로 사용
CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    current_score INT DEFAULT 0, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 투표 테이블 (Log 성격)
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id INT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 한 유저는 한 식당에 한 번만 투표 가능 (비즈니스 로직에 따라 변경 가능)
    CONSTRAINT unique_user_vote UNIQUE (user_id, restaurant_id)
);

-- 4. 인덱싱 최적화
-- 특정 식당의 투표수 집계 성능 향상
CREATE INDEX idx_votes_restaurant_id ON votes(restaurant_id);
-- 특정 유저의 투표 이력 조회 성능 향상
CREATE INDEX idx_votes_user_id ON votes(user_id);