import sys
import os
from frontend.app import DigitalClockApp

if __name__ == "__main__":
    # Ensure the script runs from the root directory
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    
    app = DigitalClockApp()
    app.run()