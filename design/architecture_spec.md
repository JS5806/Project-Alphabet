# SmartStock AI: System Architecture Specification

## 1. Overview
SmartStock AI is a predictive inventory system for convenience stores using machine learning to analyze foot traffic and local data.

## 2. Technical Stack
- **Frontend**: React.js, Tailwind CSS, Recharts (Data Visualization)
- **Backend (Business Logic)**: Java Spring Boot (Inventory CRUD, Transaction management)
- **Backend (ML/Data Ingestion)**: Python FastAPI (External API scraping, ML inference)
- **Messaging**: Apache Kafka (Real-time data streams)
- **Cache**: Redis (Session & Frequent Inventory Lookups)
- **Database**: PostgreSQL with PostGIS (GIS-based location analysis)
- **Infra**: Docker, Kubernetes (EKS), AWS S3 (Logs/Data Lake)

## 3. Data Flow
1. Public Data Portal -> FastAPI (Scraper) -> Kafka -> PostgreSQL
2. User Action (Order/Sale) -> Spring Boot -> PostgreSQL & Redis
3. ML Model -> FastAPI -> gRPC/REST -> Spring Boot -> Frontend Dashboard