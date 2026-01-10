-- PostgreSQL Schema for Core Inventory
CREATE TABLE stores (
    store_id SERIAL PRIMARY KEY,
    store_name VARCHAR(100) NOT NULL,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8)
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    unit_price DECIMAL(10, 2)
);

CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(store_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER DEFAULT 0,
    expiry_date DATE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales_history (
    sale_id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(store_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity_sold INTEGER,
    sale_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);