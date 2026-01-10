from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="SmartStore AI Demand Predictor")

class PredictRequest(BaseModel):
    store_id: int
    product_id: int
    weather_condition: str
    floating_pop_count: int

@app.post("/predict/demand")
def predict_demand(request: PredictRequest):
    # Placeholder for ML Model logic
    # In production, this would load a pre-trained scikit-learn/PyTorch model
    prediction = (request.floating_pop_count * 0.05) + (10 if request.weather_condition == 'Rain' else 5)
    return {
        "store_id": request.store_id,
        "product_id": request.product_id,
        "recommended_stock": round(prediction),
        "confidence_score": 0.89
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)