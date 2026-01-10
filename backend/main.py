from fastapi import FastAPI, BackgroundTasks
from etl_logic import SmartInventoryETL
import os

app = FastAPI(title="SmartInventory ETL Service")

# Configuration
DB_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/inventory_db")
etl_service = SmartInventoryETL(DB_URL)

@app.get("/health")
def health_check():
    return {"status": "healthy", "pipeline": "ready"}

@app.post("/trigger/etl/population")
def trigger_population_etl(region_id: str, background_tasks: BackgroundTasks):
    """Manual trigger for ETL pipeline via Dashboard"""
    def run_pipeline():
        data = etl_service.extract_public_population("YOUR_API_KEY", region_id)
        # Further processing logic...
        
    background_tasks.add_task(run_pipeline)
    return {"message": f"Population ETL triggered for {region_id}"}

@app.get("/monitoring/stats")
def get_pipeline_stats():
    # Mock data for frontend monitoring dashboard
    return {
        "total_processed_records": 125400,
        "success_rate": 99.8,
        "last_sync": "2023-10-27T10:00:00Z",
        "active_pipelines": ["Public_Pop_Sync", "Sales_Anonymizer"]
    }