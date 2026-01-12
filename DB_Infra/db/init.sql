-- 데이터베이스 스키마 및 초기 데이터 설정
USE menudb;

-- 1. 메뉴 테이블 (카테고리 필터링 성능을 위한 인덱스 설계 포함)
CREATE TABLE IF NOT EXISTS menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- [Optimization] 카테고리별 조회 속도 향상을 위한 인덱스
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 투표 세션 테이블 (마감 시간 관리)
CREATE TABLE IF NOT EXISTS vote_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    -- 만료된 세션 조회를 위한 인덱스
    INDEX idx_active_expires (is_active, expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 투표 내역 테이블
CREATE TABLE IF NOT EXISTS votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    menu_id INT NOT NULL,
    voter_ip VARCHAR(45),
    vote_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES vote_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 초기 더미 데이터
INSERT INTO menus (name, category) VALUES 
('Kimchi Stew', 'KOREAN'), ('Bibimbap', 'KOREAN'), ('Bulgogi', 'KOREAN'),
('Sushi', 'JAPANESE'), ('Ramen', 'JAPANESE'),
('Pasta', 'WESTERN'), ('Pizza', 'WESTERN'), ('Burger', 'WESTERN');