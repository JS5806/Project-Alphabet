import logging
import os

# Ensure logs directory exists
if not os.path.exists('logs'):
    os.makedirs('logs')

logging.basicConfig(
    filename='logs/heartbeat.log', 
    level=logging.INFO,
    format='%(asctime)s - [HEARTBEAT] - %(message)s'
)

def log_tick(current_time):
    """
    Logs a heartbeat for monitoring the real-time update loop stability.
    """
    logging.info(f"UI Updated at {current_time}")