require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2/promise');
const { createClient } = require('redis');
const cors = require('cors');

// --- 1. App Setup ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // 실제 운영 시 도메인 제한 필요
});

app.use(cors());
app.use(express.json());

// --- 2. Database Connections ---

// MySQL Connection Pool
const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Redis Client
const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// --- 3. Helper Functions ---

// 현재 활성화된 세션 키 반환
const SESSION_KEY = 'voting_session:current';

// --- 4. API Implementations ---

/**
 * [Main Function 2] 카테고리별 필터링
 * GET /api/menus?category=한식
 */
app.get('/api/menus', async (req, res) => {
    try {
        const { category } = req.query;
        let query = 'SELECT * FROM menus';
        let params = [];

        if (category) {
            query += ' WHERE category = ?';
            params.push(category);
        }

        const [rows] = await dbPool.execute(query, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

/**
 * [Main Function 1] 메뉴 랜덤 추천 (룰렛)
 * GET /api/menus/random?category=일식 (Category는 선택사항)
 */
app.get('/api/menus/random', async (req, res) => {
    try {
        const { category } = req.query;
        let query = 'SELECT * FROM menus';
        let params = [];

        if (category) {
            query += ' WHERE category = ?';
            params.push(category);
        }

        const [rows] = await dbPool.execute(query, params);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No menus found' });
        }

        // 랜덤 로직
        const randomIndex = Math.floor(Math.random() * rows.length);
        const randomMenu = rows[randomIndex];

        res.json({ success: true, data: randomMenu });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/**
 * [Main Function 3 & 4] 투표 세션 생성 및 초기화 (리셋 기능 포함)
 * POST /api/session/start
 * Body: { durationSeconds: 60 }
 * 설명: 기존 세션이 있다면 덮어쓰고(리셋), 새로운 마감 시간을 설정함.
 */
app.post('/api/session/start', async (req, res) => {
    try {
        const { durationSeconds = 300 } = req.body; // 기본 5분
        const now = Date.now();
        const endTime = now + (durationSeconds * 1000);

        const sessionData = {
            status: 'active',
            startTime: now,
            endTime: endTime,
            votes: JSON.stringify({}) // 메뉴ID: 득표수
        };

        // Redis에 세션 저장 (만료시간 설정으로 자동 정리 가능하지만, 명시적 관리를 위해 유지)
        await redisClient.hSet(SESSION_KEY, sessionData);
        
        // 투표 만료 시점 관리를 위해 Redis Key Expiration 설정 (옵션)
        // await redisClient.expire(SESSION_KEY, durationSeconds + 60);

        // [Team Comment] 웹소켓 이벤트: 세션 시작 알림
        io.emit('session_update', { type: 'START', endTime });

        // 서버 내부 타이머 설정 (타이머 종료 시 이벤트 발송용)
        // 주의: 서버 재시작 시 타이머가 날아가므로, 실제 프로덕션에서는 Redis Keyspace Notification 등을 사용 권장
        // 여기서는 간단한 구현을 위해 setTimeout 사용
        setTimeout(async () => {
            const currentSession = await redisClient.hGetAll(SESSION_KEY);
            if (currentSession.status === 'active') {
                // 종료 처리
                await redisClient.hSet(SESSION_KEY, 'status', 'ended');
                io.emit('session_update', { type: 'END', message: 'Voting finished!' });
            }
        }, durationSeconds * 1000);

        res.json({ success: true, message: 'New voting session started', endTime });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Redis error' });
    }
});

/**
 * [Main Function 4] 리셋 기능 (수동 종료)
 * POST /api/session/reset
 */
app.post('/api/session/reset', async (req, res) => {
    try {
        await redisClient.del(SESSION_KEY);
        io.emit('session_update', { type: 'RESET', message: 'Session has been reset.' });
        res.json({ success: true, message: 'Session reset complete' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error resetting session' });
    }
});

/**
 * [Main Function 3] 투표 하기 (유효성 검증 포함)
 * POST /api/vote
 * Body: { menuId: 1 }
 */
app.post('/api/vote', async (req, res) => {
    try {
        const { menuId } = req.body;
        
        // 1. 세션 조회
        const session = await redisClient.hGetAll(SESSION_KEY);
        
        if (!session || !session.status) {
            return res.status(400).json({ success: false, message: 'No active session' });
        }

        // 2. 유효성(Time-out) 검증 로직
        const now = Date.now();
        if (session.status !== 'active' || now > parseInt(session.endTime)) {
            return res.status(400).json({ success: false, message: 'Voting session ended' });
        }

        // 3. 투표 집계 (Redis Hash 내 JSON 조작 혹은 별도 Key 사용)
        // 간단하게 구현하기 위해 votes 필드를 파싱해서 업데이트
        let votes = JSON.parse(session.votes || '{}');
        votes[menuId] = (votes[menuId] || 0) + 1;

        await redisClient.hSet(SESSION_KEY, 'votes', JSON.stringify(votes));

        // 4. 실시간 현황 전송
        io.emit('vote_update', votes);

        res.json({ success: true, message: 'Vote accepted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * 현재 세션 정보 조회
 * GET /api/session
 */
app.get('/api/session', async (req, res) => {
    try {
        const session = await redisClient.hGetAll(SESSION_KEY);
        if (!session || !session.status) {
            return res.json({ success: true, data: null });
        }
        
        // Redis에서 가져온 데이터는 모두 문자열이므로 파싱 필요
        session.votes = JSON.parse(session.votes);
        session.startTime = parseInt(session.startTime);
        session.endTime = parseInt(session.endTime);
        
        res.json({ success: true, data: session });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Redis error' });
    }
});


// --- 5. WebSocket Event Handling ---
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// --- 6. Server Start ---
(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
        
        server.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
})();