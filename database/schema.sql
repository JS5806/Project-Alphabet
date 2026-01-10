-- OLTP Schema for ASIOS - PostgreSQL
-- Focus: Data Integrity, Atomicity, and Performance

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Product Categories (Tree Structure)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    path TEXT, -- For faster tree traversal
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products (SKU Centric)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id),
    current_stock DECIMAL(12, 4) DEFAULT 0 CHECK (current_stock >= 0),
    unit VARCHAR(20) NOT NULL,
    barcode TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Inventory Transactions (Immutable Logs for Atomicity)
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) NOT NULL,
    transaction_type ENUM('INBOUND', 'OUTBOUND', 'ADJUSTMENT') NOT NULL,
    quantity DECIMAL(12, 4) NOT NULL,
    reference_id VARCHAR(100), -- Order ID or Batch ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    worker_id UUID NOT NULL
) PARTITION BY RANGE (created_at);

-- Partitioning for scale (Monthly)
CREATE TABLE inventory_transactions_2023_10 PARTITION OF inventory_transactions
    FOR VALUES FROM ('2023-10-01') TO ('2023-11-01');

-- 4. Change Data Capture (CDC) Helper View for DW/BigQuery
CREATE VIEW v_cdc_inventory_sync AS
SELECT 
    t.id, t.product_id, p.sku, t.transaction_type, t.quantity, t.created_at
FROM inventory_transactions t
JOIN products p ON t.product_id = p.id;