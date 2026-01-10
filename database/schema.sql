-- Strategic database structure for massive click logging

-- 1. Raw Click Logs (Optimized for Write)
CREATE TABLE click_logs (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) NOT NULL,
    user_ip INET,
    country_code CHAR(2),
    device_type VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Indexing for Query Performance
CREATE INDEX idx_click_logs_code_date ON click_logs(short_code, created_at);

-- 3. Materialized View for Daily Stats (Performance optimization for Admin Dashboard)
CREATE MATERIALIZED VIEW mv_daily_stats AS
SELECT 
    short_code,
    DATE_TRUNC('day', created_at) as stat_date,
    COUNT(*) as total_clicks,
    COUNT(DISTINCT user_ip) as unique_visitors
FROM click_logs
GROUP BY 1, 2;

-- 4. Audit Log for RBAC actions
CREATE TABLE admin_audit_logs (
    id SERIAL PRIMARY KEY,
    admin_id INT,
    action_type VARCHAR(50),
    target_id VARCHAR(50),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);