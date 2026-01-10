import logging
import os

def setup_logger():
    """Utility for monitoring system performance and errors."""
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    logging.basicConfig(
        filename='logs/app_performance.log',
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    return logging.getLogger(__name__)

logger = setup_logger()
logger.info("Application Optimization Phase Started.")