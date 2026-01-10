-- PostGIS extension for spatial data analysis
CREATE EXTENSION IF NOT EXISTS postgis;

-- Raw Data Storage (Metadata for S3 tracking)
CREATE TABLE IF NOT EXISTS raw_data_logs (
    id SERIAL PRIMARY KEY,
    source_type VARCHAR(50), -- 'PUBLIC_POPULATION', 'INTERNAL_SALES'
    s3_path TEXT,
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) -- 'PENDING', 'PROCESSED', 'FAILED'
);

-- Refined Floating Population Table (Spatial-enabled)
CREATE TABLE IF NOT EXISTS floating_population (
    id SERIAL PRIMARY KEY,
    region_code VARCHAR(20),
    region_name VARCHAR(100),
    geom GEOMETRY(Point, 4326),
    pop_count INT,
    age_group VARCHAR(10),
    gender CHAR(1),
    recorded_at TIMESTAMP
);

CREATE INDEX idx_pop_geom ON floating_population USING GIST(geom);

-- Refined Sales Data (Anonymized)
CREATE TABLE IF NOT EXISTS refined_sales (
    id SERIAL PRIMARY KEY,
    product_id INT,
    category VARCHAR(50),
    gender CHAR(1),
    age_group VARCHAR(10),
    sale_amount DECIMAL(12, 2),
    sale_time TIMESTAMP,
    region_code VARCHAR(20)
);

CREATE INDEX idx_sales_region ON refined_sales(region_code);