-- 1. 사용자 테이블 (비밀번호는 Hash 저장 전제)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 투표 주제 (Topic)
CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 투표 선택지 (Options) - 정규화
CREATE TABLE IF NOT EXISTS options (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL,
    vote_count INTEGER DEFAULT 0 -- 집계 최적화를 위한 반정규화 컬럼 (Atomic Update 사용)
);

-- 4. 투표 내역 (Votes)
-- 핵심: (user_id, topic_id)에 Unique Index를 걸어 DB 레벨에서 중복 투표 원천 차단
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    topic_id INTEGER REFERENCES topics(id),
    option_id INTEGER REFERENCES options(id),
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_vote_per_topic UNIQUE (user_id, topic_id)
);

-- 조회 성능 향상을 위한 인덱스
CREATE INDEX idx_options_topic_id ON options(topic_id);
CREATE INDEX idx_votes_topic_id ON votes(topic_id);