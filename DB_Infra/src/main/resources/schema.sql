-- 식당 테이블
CREATE TABLE IF NOT EXISTS restaurants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,     -- 음식 종류 (한식, 중식 등)
    price_range VARCHAR(20) NOT NULL,  -- 가격대 (LOW, MEDIUM, HIGH)
    region_code VARCHAR(20) NOT NULL,  -- 지역 코드 (거리 필터링 대체용)
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    rating DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 방문 기록 테이블
CREATE TABLE IF NOT EXISTS user_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- [핵심 2] 카테고리 필터링 인덱싱: 복합 인덱스 (Composite Index)
-- 카디널리티가 높은 순서 혹은 조회 빈도가 높은 순서로 배치 (여기서는 등치 조건 위주)
CREATE INDEX idx_rest_composite ON restaurants (region_code, category, price_range);

-- 방문 기록 조회를 위한 인덱스
CREATE INDEX idx_history_user_date ON user_history (user_id, visited_at);