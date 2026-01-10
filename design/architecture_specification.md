# SmartStore AI Inventory Optimizer - System Architecture

## 1. Overview
This system optimizes inventory levels using real-time sales data, floating population big data, and AI-driven demand forecasting.

## 2. Component Diagram
- **Frontend**: React.js SPA (Dashboard, Heatmaps, Notifications)
- **API Gateway**: Spring Cloud Gateway or Nginx
- **Core Backend (Java/Spring Boot)**: Handles ACID transactions, FIFO logic, and inventory management.
- **AI/External Engine (Python/FastAPI)**: Processes ML models for demand forecasting and external API ingestion (Weather, Population).
- **Message Broker (Kafka)**: Decouples real-time data streams (sales events, external updates).
- **Data Layer**:
    - **PostgreSQL**: Relational data (Transactions, Inventory, User info).
    - **MongoDB**: Unstructured big data (External demographics, Logs).
    - **Redis**: Real-time caching for dashboards and session management.

## 3. Data Flow
1. Store Sales -> Kafka Topic -> Core Backend -> PostgreSQL.
2. External APIs (Weather/Pop) -> AI Engine -> MongoDB.
3. Core Backend + AI Engine -> Demand Prediction -> Push Notification to Store Manager.