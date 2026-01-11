-- [Schema Design]
-- 1. menus: 메뉴 정보를 담는 테이블
CREATE TABLE IF NOT EXISTS menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. meal_history: 사용자 식사 기록 테이블
CREATE TABLE IF NOT EXISTS meal_history (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    menu_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);

-- [Optimization]
-- 3. 복합 인덱스 생성: 특정 사용자의 최근 N일간 기록을 빠르게 조회하기 위함
-- 실행 계획(Explain) 시 idxscan을 유도하여 Full Scan 방지
CREATE INDEX idx_meal_history_user_created_at ON meal_history(user_id, created_at);

-- [Dummy Data]
-- 테스트를 위한 메뉴 데이터 삽입
INSERT INTO menus (name, category) VALUES 
('Kimchi Stew', 'Korean'), ('Bibimbap', 'Korean'), ('Bulgogi', 'Korean'),
('Sushi', 'Japanese'), ('Ramen', 'Japanese'), ('Udon', 'Japanese'),
('Burger', 'Western'), ('Pizza', 'Western'), ('Pasta', 'Western'),
('Tacos', 'Mexican'), ('Pho', 'Vietnamese'), ('Salad', 'Diet');