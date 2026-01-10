-- Database Initialization
CREATE TABLE IF NOT EXISTS cosmetics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    expiry_date DATE NOT NULL,
    opened_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optimization: Indexes for date-based filtering
CREATE INDEX idx_expiry_date ON cosmetics (expiry_date);
CREATE INDEX idx_opened_at ON cosmetics (opened_at);

-- Sample Data
INSERT INTO cosmetics (name, brand, expiry_date, opened_at) VALUES 
('Hydrating Serum', 'Glow Recipe', '2024-06-01', '2023-01-15'),
('Sunscreen SPF50', 'La Roche-Posay', '2025-12-30', '2024-02-10'),
('Night Cream', 'Estee Lauder', '2024-11-20', '2023-05-20');