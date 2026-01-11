-- PostgreSQL 초기화 스크립트

-- 1. 메뉴 테이블 생성
CREATE TABLE IF NOT EXISTS menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- [설계 2] 카테고리 필터링 인덱스 설계
-- 이유: 특정 카테고리(한식, 중식 등) 조회 시 Full Table Scan 방지 및 조회 성능 향상
CREATE INDEX idx_menus_category ON menus(category);

-- 테스트 데이터 삽입 (예시)
INSERT INTO menus (name, category, price) VALUES
('Kimchi Stew', 'KOREAN', 8000),
('Bibimbap', 'KOREAN', 7500),
('Pasta', 'WESTERN', 12000),
('Pizza', 'WESTERN', 15000),
('Sushi', 'JAPANESE', 18000),
('Udon', 'JAPANESE', 7000),
('Burger', 'WESTERN', 9000),
('Tteokbokki', 'KOREAN', 5000);