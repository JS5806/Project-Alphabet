# Intelligent Dashboard UX Specification

## 1. Actionable Insight Strategy
- **Target**: Store managers (focus on clarity over complexity).
- **Key Metric**: 'Recommended Order' highlighted in high-contrast colors.
- **Anomaly Alerts**: 
  - `Warning`: Inventory dropping faster than predicted.
  - `Critical`: Stock-out expected within 6 hours.

## 2. Notification Flow
1. AI Engine (Python) detects anomaly -> Pushes to Redis Pub/Sub.
2. Backend (Node.js) consumes message -> Writes to PostgreSQL Alert Log -> Dispatches SSE to Frontend.
3. Frontend displays 'Toast' notification -> One-click link to Order Modal.