-- User Profile Table Extension
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(30) UNIQUE,
    bio TEXT,
    profile_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nickname (nickname)
);

-- Storage Metadata Table (Mocking S3 Asset tracking)
CREATE TABLE IF NOT EXISTS user_assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    asset_type ENUM('profile_image', 'cover_image'),
    s3_key VARCHAR(255),
    file_size INT,
    mime_type VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
);