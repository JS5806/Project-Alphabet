const { Pool } = require('pg');
const { createClient } = require('redis');
require('dotenv').config();

// PostgreSQL Pool 설정
const pgPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Redis Client 설정
const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// 초기화 함수
const connectDB = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
        // PG 연결 테스트
        await pgPool.query('SELECT 1'); 
        console.log('Connected to PostgreSQL');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

module.exports = { pgPool, redisClient, connectDB };