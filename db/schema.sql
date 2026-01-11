-- 1. 사용자 테이블
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 식당 테이블
CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 투표 내역 테이블
-- 동시성 이슈 해결 전략 1: DB 차원의 Unique Constraint로 중복 투표 원천 봉쇄
CREATE TABLE votes (
    vote_id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(restaurant_id),
    vote_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- [Integrity] 한 유저는 하루에 한 번만 투표 가능 (복합 유니크 인덱스)
    CONSTRAINT uq_user_vote_per_day UNIQUE (user_id, vote_date)
);

-- 4. 일별 집계 결과 (Materialized View 또는 별도 테이블로 성능 최적화)
CREATE TABLE daily_results (
    result_date DATE NOT NULL,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(restaurant_id),
    vote_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (result_date, restaurant_id)
);

-- 인덱스: 조회 성능 향상
CREATE INDEX idx_votes_date ON votes(vote_date);
CREATE INDEX idx_restaurants_active ON restaurants(is_active);

-- [Concurrency Strategy]
-- 트래픽 스파이크 시 안전하게 투표하고 실시간 집계 테이블을 갱신하는 트랜잭션 함수
CREATE OR REPLACE FUNCTION cast_vote(_user_id INTEGER, _restaurant_id INTEGER) 
RETURNS VOID AS $$
BEGIN
    -- 트랜잭션 시작 (호출부에서 처리하거나 여기서 명시)
    
    -- 1. 투표 기록 삽입 (Unique Constraint 위반 시 예외 발생으로 중복 방지)
    INSERT INTO votes (user_id, restaurant_id, vote_date)
    VALUES (_user_id, _restaurant_id, CURRENT_DATE);

    -- 2. 집계 테이블 갱신 (Row Level Locking을 통해 원자성 보장)
    -- UPSERT 구문을 사용하여 Race Condition 최소화
    INSERT INTO daily_results (result_date, restaurant_id, vote_count)
    VALUES (CURRENT_DATE, _restaurant_id, 1)
    ON CONFLICT (result_date, restaurant_id)
    DO UPDATE SET 
        vote_count = daily_results.vote_count + 1,
        updated_at = CURRENT_TIMESTAMP;

EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'User % has already voted today.', _user_id;
END;
$$ LANGUAGE plpgsql;