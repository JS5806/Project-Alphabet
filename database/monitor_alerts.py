import time

THRESHOLD = 0.20 # 20% error threshold

def check_system_health(current_error):
    """
    Simulates infrastructure monitoring for prediction drift.
    """
    if current_error > THRESHOLD:
        send_alert_to_devops(current_error)

def send_alert_to_devops(error_val):
    print(f"[ALERT] Critical Error Threshold Exceeded: {error_val*100}%")
    print("[ACTION] Initiating automatic rollback to Version: baseline_v1.0")

if __name__ == "__main__":
    # Simulation loop
    mock_errors = [0.12, 0.15, 0.22, 0.18]
    for err in mock_errors:
        check_system_health(err)
        time.sleep(1)