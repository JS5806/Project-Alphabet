-- Table for Notification History and Tracking
CREATE TABLE notification_logs (
    id SERIAL PRIMARY KEY,
    store_id INT NOT NULL,
    level VARCHAR(20) NOT NULL, -- 'INFO', 'WARNING', 'CRITICAL'
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_taken BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Orders with Transaction Integrity
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    source VARCHAR(50) DEFAULT 'AI_RECOMMENDED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notif_store ON notification_logs(store_id, is_read);