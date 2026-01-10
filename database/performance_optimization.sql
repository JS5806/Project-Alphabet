-- 대시보드 통계 쿼리 가속을 위한 인덱스
CREATE INDEX idx_stock_expiry_date ON stocks (expiryDate);

-- 바코드 검색 최적화
CREATE INDEX idx_stock_barcode ON stocks (barcode);

-- 빈번한 집계 쿼리를 위한 복합 인덱스 (선택 사항)
CREATE INDEX idx_stock_status_agg ON stocks (expiryDate, quantity);