from datetime import datetime

def get_current_time_string():
    """
    Extracts system time and formats it to HH:M:SS.
    Targeting high accuracy for the UI update logic.
    """
    now = datetime.now()
    return now.strftime('%H:%M:%S')