-- Metadata Schema (PostgreSQL)
CREATE TABLE devices (
    id VARCHAR(50) PRIMARY KEY,
    device_type VARCHAR(20) NOT NULL,
    location VARCHAR(100),
    status VARCHAR(20) DEFAULT 'offline',
    last_seen TIMESTAMP
);

CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) REFERENCES devices(id),
    alert_type VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time-Series Note (InfluxDB)
-- Retention Policy: 30 days
-- Measurement: sensor_data
-- Tags: device_id, site_id
-- Fields: temperature (float), humidity (float), soil_moisture (float)