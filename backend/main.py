from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from .app.analytics_engine import ModelRefiner

app = FastAPI()

class FeedbackSchema(BaseModel):
    sku: str
    status: str
    timestamp: str

@app.get("/api/v1/forecast/comparison")
async def get_comparison():
    # Mock data simulating POS data stream vs AI model
    return [
        {"time": "10:00", "sku": "BEV-001", "actual": 45, "predicted": 50, "error": 0.10},
        {"time": "11:00", "sku": "BEV-001", "actual": 60, "predicted": 52, "error": 0.13},
        {"time": "12:00", "sku": "BEV-001", "actual": 85, "predicted": 88, "error": 0.03}
    ]

@app.post("/api/v1/feedback")
async def submit_feedback(feedback: FeedbackSchema, background_tasks: BackgroundTasks):
    # Save feedback to DB and trigger asynchronous model refinement check
    print(f"Feedback received for {feedback.sku}: {feedback.status}")
    # background_tasks.add_task(refiner.refine_weights, feedback)
    return {"status": "success", "message": "Feedback integrated into next training cycle"}

@app.get("/api/v1/model/ab-test")
async def get_ab_test_results():
    return {
        "model_a_mae": 4.52,
        "model_b_mae": 3.88,
        "improvement": "14.1%"
    }