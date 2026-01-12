require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// DB 연결 풀 설정 (AWS RDS 연결 정보는 환경변수로 주입)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, // 커넥션 풀 크기 제한
    idleTimeoutMillis: 30000
});

// JWT 미들웨어
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// 1. 사용자 회원가입 (간소화)
app.post('/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 1. 사용자 로그인 (JWT 발급)
app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) return res.status(400).send('User not found');

        const user = result.rows[0];
        if (await bcrypt.compare(password, user.password_hash)) {
            const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ accessToken });
        } else {
            res.status(403).send('Incorrect password');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. 투표 안건 생성
app.post('/topics', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { title, description, options } = req.body;
        
        // Topic 생성
        const topicRes = await client.query(
            'INSERT INTO topics (title, description, created_by) VALUES ($1, $2, $3) RETURNING id',
            [title, description, req.user.id]
        );
        const topicId = topicRes.rows[0].id;

        // Options 생성
        for (const opt of options) {
            await client.query(
                'INSERT INTO options (topic_id, option_text) VALUES ($1, $2)',
                [topicId, opt]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Topic created successfully', topicId });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

/**
 * 3. 투표 트랜잭션 처리 (ACID, 동시성 제어)
 * - Race Condition 해결 전략:
 *   1. DB의 Unique Index (user_id, topic_id)로 중복 투표 물리적 차단
 *   2. Transaction 내에서 Vote Insert와 Option Count Update를 원자적으로 수행
 *   3. 'UPDATE ... SET count = count + 1' 구문은 Postgres에서 Row-level Lock을 사용하여 안전함
 */
app.post('/vote', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    try {
        const { topicId, optionId } = req.body;
        const userId = req.user.id;

        await client.query('BEGIN');

        // 1. 투표 기록 생성 (중복 시 여기서 에러 발생 - Unique Constraint Violation)
        // 409 Conflict 반환을 위해 try-catch로 감싸지 않고 DB 에러 코드로 분기할 수도 있음
        await client.query(
            'INSERT INTO votes (user_id, topic_id, option_id) VALUES ($1, $2, $3)',
            [userId, topicId, optionId]
        );

        // 2. 집계 카운트 증가 (Atomic Update)
        // Postgres는 이 행에 대해 트랜잭션이 끝날 때까지 Lock을 걺
        await client.query(
            'UPDATE options SET vote_count = vote_count + 1 WHERE id = $1',
            [optionId]
        );

        await client.query('COMMIT');
        res.status(200).json({ message: 'Vote recorded successfully' });

    } catch (error) {
        await client.query('ROLLBACK');
        if (error.code === '23505') { // Unique constraint violation code
            res.status(409).json({ error: 'You have already voted on this topic.' });
        } else {
            res.status(500).json({ error: error.message });
        }
    } finally {
        client.release();
    }
});

// 4. 실시간 결과 집계 (효율적인 쿼리)
app.get('/topics/:id/result', async (req, res) => {
    try {
        const { id } = req.params;
        // options 테이블에 vote_count가 있으므로 join 없이 조회 가능하여 매우 빠름
        // 데이터 정합성 검증을 위해 가끔 votes 테이블을 count(*) 하는 배치를 별도로 돌릴 수 있음
        const result = await pool.query(
            'SELECT id, option_text, vote_count FROM options WHERE topic_id = $1 ORDER BY vote_count DESC',
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});