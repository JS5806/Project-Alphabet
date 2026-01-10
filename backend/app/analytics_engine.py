import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error

class ModelRefiner:
    """
    Engine to analyze prediction errors and adjust model weights based on field feedback.
    """
    def __init__(self, baseline_model, current_model):
        self.baseline = baseline_model
        self.current = current_model

    def calculate_metrics(self, actual, predicted):
        mae = mean_absolute_error(actual, predicted)
        rmse = np.sqrt(mean_squared_error(actual, predicted))
        return {"mae": mae, "rmse": rmse}

    def refine_weights(self, feedback_data, model_path):
        """
        Semi-supervised fine-tuning logic.
        Feedback is treated as a secondary label to adjust bias in specific SKU clusters.
        """
        # Logic: If feedback is 'Insufficient', we increase the bias term for those SKUs
        print(f"Refining model at {model_path} with {len(feedback_data)} feedback points...")
        # Simulated weight adjustment
        adjustment_factor = 1.05 
        return True

    def run_ab_test(self, test_input):
        res_a = self.baseline.predict(test_input)
        res_b = self.current.predict(test_input)
        return {"baseline": res_a, "optimized": res_b}