from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import redis
import json
from .engine import ForecastEngine

app = FastAPI(title="SmartInventory AI Forecaster API")
cache = redis.Redis(host='redis', port=6379, db=0)
engine = ForecastEngine()

class ForecastRequest(BaseModel):
    item_id: str
    history: List[float]
    current_stock: float
    market_price: float
    avg_cost: float

@app.post("/api/v1/predict")
async def get_forecast(req: ForecastRequest):
    # 1. Check Cache
    cache_key = f"forecast_{req.item_id}"
    cached_res = cache.get(cache_key)
    if cached_res:
        return json.loads(cached_res)

    # 2. Run AI Logic
    try:
        demand_forecast = engine.predict_demand(req.history)
        optimal_order = engine.calculate_optimal_order(
            demand_forecast, req.current_stock, req.market_price, req.avg_cost
        )
        
        result = {
            "item_id": req.item_id,
            "demand_forecast": demand_forecast,
            "optimal_order_quantity": optimal_order,
            "status": "success"
        }
        
        # 3. Cache Result (TTL 1 hour)
        cache.setex(cache_key, 3600, json.dumps(result))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))