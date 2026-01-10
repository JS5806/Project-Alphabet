-- Persistence Schema for PostgreSQL (Step 1)
CREATE TABLE short_urls (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    click_count INTEGER DEFAULT 0
);

CREATE INDEX idx_short_code ON short_urls(short_code);
-- Performance Note: Use B-Tree index for O(log n) lookups if not using Redis cache.