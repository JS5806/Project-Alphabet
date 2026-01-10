# Big Data Infrastructure Design

## 1. Data Lake (AWS S3)
- **Raw Zone**: Stores original JSON/CSV from Public APIs and internal ERP.
- **Refined Zone**: Stores cleaned Parquet files after Spark/Pandas transformation.

## 2. ETL Orchestration (Apache Airflow)
- **DAG Name**: `smart_inventory_master_etl`
- **Schedule**: `@hourly` for population data, `@daily` for sales records.
- **Retry Strategy**: 3 retries with exponential backoff for external API calls.

## 3. Database (PostgreSQL + PostGIS)
- Used for serving the dashboard and AI model training features.
- Spatial indexing on `geom` columns to support fast heatmap rendering for UX.

## 4. Scalability
- **Docker**: All services containerized for consistency.
- **Kubernetes (K8s)**: Horizontal Pod Autoscaler (HPA) triggers when ETL processing load exceeds 70% CPU.