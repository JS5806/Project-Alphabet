import tkinter as tk
import time
import json
import os
import sys

class OptimizedDigitalClock:
    def __init__(self, root):
        self.root = root
        self.load_config()
        
        self.root.title(self.config.get("window_title", "Digital Clock"))
        self.root.configure(bg=self.config.get("bg_color", "black"))
        
        # GUI Optimization: Fixed window size to prevent recalculating layout
        self.root.resizable(False, False)
        
        self.time_label = tk.Label(
            root,
            font=(self.config.get("font_family", "Arial"), self.config.get("font_size", 48), 'bold'),
            bg=self.config.get("bg_color", "black"),
            fg=self.config.get("fg_color", "green"),
            padx=30,
            pady=30
        )
        self.time_label.pack(expand=True)
        
        # Initial Update
        self.update_clock()
        
        # Graceful Shutdown
        self.root.protocol("WM_DELETE_WINDOW", self.on_exit)

    def load_config(self):
        """Loads UI configuration from JSON for easy optimization without code change."""
        try:
            # Navigate to design folder
            base_path = os.path.dirname(os.path.abspath(__file__))
            config_path = os.path.join(base_path, '..', 'design', 'theme.json')
            with open(config_path, 'r') as f:
                self.config = json.load(f)
        except Exception as e:
            print(f"Config load error: {e}. Using defaults.")
            self.config = {}

    def update_clock(self):
        """Low CPU usage time update loop."""
        current_time = time.strftime('%H:%M:%S')
        if self.time_label['text'] != current_time:
            self.time_label.config(text=current_time)
        
        # Schedule next update based on config (typically 1000ms)
        interval = self.config.get("update_interval_ms", 1000)
        self.root.after(interval, self.update_clock)

    def on_exit(self):
        """Resource cleanup before closing."""
        self.root.destroy()
        sys.exit(0)

if __name__ == "__main__":
    root = tk.Tk()
    app = OptimizedDigitalClock(root)
    root.mainloop()