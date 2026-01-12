-- [1] 사용자 인증 및 세션 관리
-- 사용자 테이블: JWT 연동을 위한 설계
-- password_hash: bcrypt 등의 해시 저장
-- role: 'USER', 'ADMIN' 등 권한 관리
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(50),
    role user_role DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- 인덱스: 로그인 시 이메일 조회가 빈번하므로 인덱스 생성
CREATE INDEX idx_users_email ON users(email);

-- [2] 식당 데이터 관리 (정규화 및 최적화)
CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스: 카테고리별 조회 및 이름 검색 최적화
CREATE INDEX idx_restaurants_category ON restaurants(category);
CREATE INDEX idx_restaurants_name ON restaurants(name);

-- [3] 투표 트랜잭션 처리
-- 투표 테이블: 한 사용자가 한 식당에 대해 하루에 한 번만 투표 가능하도록 설계
CREATE TABLE votes (
    vote_id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    restaurant_id INT NOT NULL REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 데이터 무결성 보장: 동일 사용자가 같은 식당에 중복 투표 방지 (또는 날짜별 1회 제한 등 정책에 따라 수정)
    CONSTRAINT uk_user_restaurant_vote UNIQUE (user_id, restaurant_id)
);

-- 인덱스: 특정 식당의 총 득표수 집계를 위한 인덱스
CREATE INDEX idx_votes_restaurant_id ON votes(restaurant_id);