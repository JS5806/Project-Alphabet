-- Using TimeScaleDB for high-performance time-series AI data
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

CREATE TABLE inventory_history (
    time TIMESTAMPTZ NOT NULL,
    item_id VARCHAR(50) NOT NULL,
    stock_level DOUBLE PRECISION,
    unit_cost DOUBLE PRECISION
);

-- Create hypertable for performance
SELECT create_hypertable('inventory_history', 'time');

CREATE TABLE demand_predictions (
    prediction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id VARCHAR(50) NOT NULL,
    forecast_date DATE NOT NULL,
    predicted_quantity DOUBLE PRECISION,
    confidence_interval_high DOUBLE PRECISION,
    confidence_interval_low DOUBLE PRECISION,
    model_version VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_item_time ON inventory_history (item_id, time DESC);