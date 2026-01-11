-- N+1 문제 방지 및 통계 쿼리 단순화를 위한 View 생성
-- 각 세션별, 식당별 득표수를 미리 집계하여 식당 정보와 함께 반환
CREATE OR REPLACE VIEW view_session_results AS
SELECT 
    v.session_id,
    r.id AS restaurant_id,
    r.name AS restaurant_name,
    r.category,
    COUNT(v.id) AS vote_count
FROM 
    restaurants r
LEFT JOIN 
    votes v ON r.id = v.restaurant_id
GROUP BY 
    v.session_id, r.id, r.name, r.category;