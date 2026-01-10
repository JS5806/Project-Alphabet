from fastapi import FastAPI
import redis
import json

app = FastAPI()
r = redis.Redis(host='localhost', port=6379, db=0)

def detect_anomaly(current_stock, predicted_demand):
    """Logic to trigger alerts based on threshold flexibility"""
    if current_stock < (predicted_demand * 0.2):
        return "CRITICAL"
    elif current_stock < predicted_demand:
        return "WARNING"
    return None

@app.post("/analyze-stock")
async def analyze_stock(data: dict):
    # Simplified anomaly detection logic
    status = detect_anomaly(data['current_stock'], data['predicted_demand'])
    if status:
        alert_payload = {
            "store_id": data['store_id'],
            "level": status,
            "message": f"Inventory alert: Current {data['current_stock']} vs Predicted {data['predicted_demand']}"
        }
        r.publish('inventory_alerts', json.dumps(alert_payload))
        return {"status": "alert_triggered", "level": status}
    return {"status": "stable"}