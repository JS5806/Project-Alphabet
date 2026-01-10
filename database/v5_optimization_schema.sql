-- Schema for Field Testing and Model Versioning

CREATE TABLE field_feedback (
    id SERIAL PRIMARY KEY,
    sku_id VARCHAR(50) NOT NULL,
    user_feedback VARCHAR(20) CHECK (user_feedback IN ('Excess', 'Optimal', 'Insufficient')),
    actual_sales INT,
    predicted_sales INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE model_versions (
    version_id VARCHAR(20) PRIMARY KEY,
    model_path TEXT NOT NULL,
    mae_score FLOAT,
    rmse_score FLOAT,
    is_active BOOLEAN DEFAULT FALSE,
    deployed_at TIMESTAMP
);

-- Performance Monitoring View
CREATE VIEW model_performance_summary AS
SELECT 
    sku_id, 
    AVG(ABS(actual_sales - predicted_sales)) as avg_error,
    COUNT(id) as feedback_count
FROM field_feedback
GROUP BY sku_id;