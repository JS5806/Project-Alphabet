from datetime import datetime

class TimeManager:
    @staticmethod
    def get_current_time_string():
        """
        Returns the current system time in HH:MM:SS format.
        Minimizes drift by fetching directly from system clock on each call.
        """
        return datetime.now().strftime("%H:%M:%S")

    @staticmethod
    def get_current_date_string():
        """
        Returns the current date in YYYY-MM-DD format.
        """
        return datetime.now().strftime("%Y-%m-%d")