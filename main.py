import tkinter as tk
from frontend.clock_ui import ClockApp
import sys

def main():
    try:
        root = tk.Tk()
        app = ClockApp(root)
        
        # Protocol for clean exit
        root.protocol("WM_DELETE_WINDOW", root.destroy)
        
        root.mainloop()
    except Exception as e:
        print(f"Application failed to start: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()