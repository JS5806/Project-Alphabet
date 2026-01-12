-- 1. 사용자(User) 테이블: OAuth 및 로컬 로그인 통합
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- 로컬 로그인용 (OAuth 유저는 NULL 가능)
    nickname VARCHAR(50) NOT NULL,
    provider VARCHAR(20) DEFAULT 'local', -- 'local', 'google', 'kakao' 등
    provider_id VARCHAR(255), -- OAuth 제공자 측의 고유 ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_provider_id UNIQUE (provider, provider_id)
);

-- 2. 식당(Restaurants) 테이블: 위치 데이터 모델링
CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    -- 위도(latitude), 경도(longitude): 정밀도를 위해 DECIMAL 사용
    latitude DECIMAL(10, 8) NOT NULL, 
    longitude DECIMAL(11, 8) NOT NULL,
    vote_count INT DEFAULT 0, -- 읽기 성능 향상을 위한 반정규화 컬럼
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- [Team Comment 반영] PostGIS 도입 전, 일반 B-Tree 복합 인덱스로 범위 검색 최적화
-- 특정 위/경도 범위(Bounding Box) 조회 시 성능 향상
CREATE INDEX idx_restaurants_lat_lon ON restaurants (latitude, longitude);

-- 3. 투표(Votes) 테이블: 트랜잭션 관리 대상
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id INT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- 한 유저는 한 식당에 한 번만 투표 가능 (데이터 무결성)
    CONSTRAINT uq_user_restaurant_vote UNIQUE (user_id, restaurant_id)
);

-- 4. 투표 트랜잭션 처리 함수 (Stored Procedure)
-- 동시성 이슈 제어 및 vote_count 원자적 업데이트 보장
CREATE OR REPLACE FUNCTION cast_vote(p_user_id INT, p_restaurant_id INT) 
RETURNS BOOLEAN AS $$
BEGIN
    -- 트랜잭션 시작 (함수 호출 자체가 트랜잭션 내에서 수행됨)
    
    -- 중복 투표 체크 (이미 존재하면 예외 발생 대신 FALSE 반환 처리 가능)
    IF EXISTS (SELECT 1 FROM votes WHERE user_id = p_user_id AND restaurant_id = p_restaurant_id) THEN
        RETURN FALSE;
    END IF;

    -- 투표 기록 삽입
    INSERT INTO votes (user_id, restaurant_id) 
    VALUES (p_user_id, p_restaurant_id);

    -- 식당 총 투표수 증가 (Row Level Lock 발생으로 동시성 제어)
    UPDATE restaurants 
    SET vote_count = vote_count + 1 
    WHERE id = p_restaurant_id;

    RETURN TRUE;
EXCEPTION
    WHEN unique_violation THEN
        -- 동시성 문제로 인한 중복 삽입 시도 시 처리
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- 5. 위치 기반 식당 조회 쿼리 예시 (MVP용)
-- 애플리케이션 레벨에서 Haversine 공식을 사용하거나, 
-- DB 레벨에서 사각 범위(Bounding Box)로 1차 필터링 후 정렬
/*
SELECT *, 
    (6371 * acos(cos(radians(:user_lat)) * cos(radians(latitude)) 
    * cos(radians(longitude) - radians(:user_lon)) 
    + sin(radians(:user_lat)) * sin(radians(latitude)))) AS distance 
FROM restaurants
WHERE latitude BETWEEN :min_lat AND :max_lat 
  AND longitude BETWEEN :min_lon AND :max_lon
ORDER BY distance ASC
LIMIT 20;
*/