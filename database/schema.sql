-- SmartStock AI Data Architecture
-- PostgreSQL Schema for Inventory and Regional Analysis

-- Product Master Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    unit_price DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Records (FIFO Strategy Support)
CREATE TABLE stock_records (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    remaining_quantity INT NOT NULL, -- For FIFO tracking
    transaction_type VARCHAR(10) CHECK (transaction_type IN ('IN', 'OUT')),
    unit_cost DECIMAL(12, 2),
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Regional/Demographic Data (Partitioned for performance)
CREATE TABLE regional_demographics (
    id SERIAL,
    region_code VARCHAR(20) NOT NULL,
    region_name VARCHAR(100),
    floating_population INT,
    gender VARCHAR(10),
    age_group VARCHAR(20),
    recorded_date DATE NOT NULL,
    PRIMARY KEY (id, recorded_date)
) PARTITION BY RANGE (recorded_date);

-- Performance Indexes
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_stock_product_date ON stock_records(product_id, created_at);
CREATE INDEX idx_demographics_filter ON regional_demographics(region_code, gender, age_group);