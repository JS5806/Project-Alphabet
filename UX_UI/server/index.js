const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

// DB 설정 (환경에 맞게 수정 필요)
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'lunch_db',
    password: 'password',
    port: 5432,
});

app.use(cors());
app.use(express.json());

// 추천 API
app.post('/api/recommend', async (req, res) => {
    const { cuisines, priceRanges, excludedIds } = req.body;

    // 동적 쿼리 생성
    let query = 'SELECT * FROM restaurants WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    // 1. 카테고리 필터링
    if (cuisines && cuisines.length > 0) {
        query += ` AND cuisine = ANY($${paramIndex})`;
        params.push(cuisines);
        paramIndex++;
    }

    // 2. 가격대 필터링
    if (priceRanges && priceRanges.length > 0) {
        query += ` AND price_range = ANY($${paramIndex})`;
        params.push(priceRanges);
        paramIndex++;
    }

    // 3. 최근 방문 기록 제외 로직 (excludedIds가 있을 경우)
    if (excludedIds && excludedIds.length > 0) {
        query += ` AND id != ANY($${paramIndex})`;
        params.push(excludedIds);
        paramIndex++;
    }

    // 랜덤 정렬 및 1개 추출
    query += ' ORDER BY RANDOM() LIMIT 1';

    try {
        const result = await pool.query(query, params);
        
        if (result.rows.length > 0) {
            res.json({ success: true, data: result.rows[0] });
        } else {
            // [Team Comment 반영] 결과가 없을 경우
            res.json({ success: false, message: 'NO_MATCH' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});