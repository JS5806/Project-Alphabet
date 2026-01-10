-- Database performance tuning for large datasets
-- Indexing frequently queried columns for D-Day sorting and user filtering

CREATE INDEX idx_cosmetic_expiry_date ON cosmetics (expiry_date);
CREATE INDEX idx_cosmetic_user_id ON cosmetics (user_id);

-- Maintenance: Analyze tables for query optimizer
ANALYZE TABLE cosmetics;

-- Security: Ensure data at rest is encrypted (conceptual for RDS/AES)
-- ALTER TABLE users MODIFY COLUMN personal_info VARBINARY(255); -- If using app-level encryption