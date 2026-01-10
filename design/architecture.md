# ASIOS Data Architecture (Phase 1)

## 1. Hybrid Data Strategy
- **OLTP (PostgreSQL)**: Handles real-time inventory movements. Normalization (3NF) is strictly enforced to prevent data anomalies. Transactional integrity is managed via Pessimistic Locking on the SKU level.
- **OLAP (BigQuery)**: Data is streamed from PostgreSQL via a CDC (Change Data Capture) pipeline. This allows for heavy AI-driven forecasting without impacting the production DB performance.

## 2. Real-time Synchronization
- **WebSocket**: Client-side state (Zustand) is synced via WebSockets for real-time dashboard updates when stock levels change across different warehouses.
- **Atomicity**: Every movement (In/Out) is wrapped in a single database transaction. If the log entry fails, the stock count remains unchanged.

## 3. UI/UX Principles
- **Touch-First**: Minimum button size 64px for glove-friendly operations.
- **Dark Mode**: Optimized for low-light warehouse environments to reduce eye strain (Background: #0f172a).
- **Virtualization**: Using `react-window` for product lists exceeding 10,000 SKUs to maintain 60FPS.