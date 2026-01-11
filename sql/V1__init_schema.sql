-- UUID 확장 활성화 (ID 생성을 위해 사용 가능하나, 여기서는 MVP를 위해 BIGSERIAL 사용)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() -- UTC 기준 저장
);

-- 2. Restaurants Table
CREATE TABLE restaurants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Vote Sessions Table (투표방)
CREATE TABLE vote_sessions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    start_time_utc TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time_utc TIMESTAMPTZ NOT NULL, -- 마감 시간 (UTC)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Votes Table (투표 내역)
CREATE TABLE votes (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES vote_sessions(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    
    -- 한 세션에서 유저는 한 번만 투표 가능 (DB 레벨 중복 방지)
    CONSTRAINT uq_user_session_vote UNIQUE (session_id, user_id)
);

-- 인덱스 설정 (성능 최적화)
CREATE INDEX idx_votes_session_restaurant ON votes(session_id, restaurant_id);