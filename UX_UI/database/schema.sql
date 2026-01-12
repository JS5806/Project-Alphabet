-- PostgreSQL 데이터베이스 및 테이블 생성 스크립트

CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cuisine VARCHAR(50) NOT NULL, -- KOREAN, CHINESE, JAPANESE, WESTERN, ETC
    price_range VARCHAR(20) NOT NULL, -- CHEAP, MEDIUM, EXPENSIVE
    description TEXT,
    image_url TEXT
);

-- 더미 데이터 삽입
INSERT INTO restaurants (name, cuisine, price_range, description) VALUES
('할머니 순대국', 'KOREAN', 'CHEAP', '뜨끈한 국물이 일품인 순대국집'),
('진진 마라탕', 'CHINESE', 'MEDIUM', '원하는 재료를 골라먹는 매운맛'),
('스시 오마카세', 'JAPANESE', 'EXPENSIVE', '신선한 제철 생선 초밥'),
('버거 킹덤', 'WESTERN', 'CHEAP', '육즙 가득한 수제 버거'),
('파스타 앤 모어', 'WESTERN', 'MEDIUM', '데이트하기 좋은 파스타 맛집'),
('김치찌개 전문점', 'KOREAN', 'CHEAP', '라면사리 무제한 제공'),
('북경 반점', 'CHINESE', 'CHEAP', '가성비 좋은 짜장면과 탕수육'),
('돈카츠 명인', 'JAPANESE', 'MEDIUM', '바삭한 튀김옷의 정통 일식 돈까스'),
('한우 정육식당', 'KOREAN', 'EXPENSIVE', '입에서 살살 녹는 1++ 한우');