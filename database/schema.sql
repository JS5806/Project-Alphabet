-- Enable PostGIS for geographic analysis
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    location GEOGRAPHY(POINT, 4326)
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id),
    product_name VARCHAR(100),
    current_stock INTEGER,
    safety_stock INTEGER,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE foot_traffic_logs (
    id SERIAL PRIMARY KEY,
    region_id VARCHAR(50),
    timestamp TIMESTAMP,
    visitor_count INTEGER,
    weather_condition VARCHAR(50)
);