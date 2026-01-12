/* MySQL 데이터베이스 스키마 및 초기 데이터 */
CREATE DATABASE IF NOT EXISTS lunch_db;
USE lunch_db;

CREATE TABLE IF NOT EXISTS menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 한식, 중식, 일식, 양식 등
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 초기 데이터 시딩
INSERT INTO menus (name, category) VALUES
('김치찌개', '한식'), ('비빔밥', '한식'), ('불고기', '한식'),
('짜장면', '중식'), ('짬뽕', '중식'), ('탕수육', '중식'),
('초밥', '일식'), ('돈까스', '일식'), ('우동', '일식'),
('파스타', '양식'), ('피자', '양식'), ('햄버거', '양식');