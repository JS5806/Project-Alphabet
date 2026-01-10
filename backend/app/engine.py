import numpy as np
import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing

class ForecastEngine:
    def __init__(self):
        # In a real scenario, we would load a pre-trained PyTorch/LSTM or Prophet model
        pass

    def predict_demand(self, history_data, forecast_days=7):
        """
        Simple Exponential Smoothing for demonstration.
        In production, this replaces with the LSTM/Prophet model registry from MLflow.
        """
        df = pd.Series(history_data)
        model = ExponentialSmoothing(df, seasonal='add', seasonal_periods=7).fit()
        forecast = model.forecast(forecast_days)
        return forecast.tolist()

    def calculate_optimal_order(self, predicted_demand, current_stock, market_price, avg_cost):
        """
        Logic: If market price is lower than average cost by 10%+, 
        increase order quantity (Strategic Stockpiling).
        """
        base_order = max(0, sum(predicted_demand) - current_stock)
        
        price_weight = 1.0
        if market_price < (avg_cost * 0.9):
            price_weight = 1.3  # Buy 30% more because it's cheap
        elif market_price > (avg_cost * 1.2):
            price_weight = 0.7  # Buy 30% less because it's expensive
            
        return round(base_order * price_weight, 2)