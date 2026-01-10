import tkinter as tk
from backend.logic import TimeManager

class DigitalClockApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Simple Digital Clock")
        self.root.geometry("450x200")
        self.root.configure(bg="#282c34")
        
        # Initialize UI Components
        self._setup_ui()
        
    def _setup_ui(self):
        # Container frame for centering
        self.main_frame = tk.Frame(self.root, bg="#282c34")
        self.main_frame.place(relx=0.5, rely=0.5, anchor="center")

        # Date Label
        self.date_label = tk.Label(
            self.main_frame, 
            text="", 
            font=("Consolas", 14), 
            bg="#282c34", 
            fg="#abb2bf"
        )
        self.date_label.pack(pady=(0, 5))

        # Clock Label
        self.time_label = tk.Label(
            self.main_frame, 
            text="00:00:00", 
            font=("Consolas", 60, "bold"), 
            bg="#282c34", 
            fg="#61dafb"
        )
        self.time_label.pack()

    def update_clock(self):
        """
        Recursive update function using root.after()
        Minimizes CPU overhead and prevents stack overflow by using Tkinter's event loop.
        """
        current_time = TimeManager.get_current_time_string()
        current_date = TimeManager.get_current_date_string()
        
        self.time_label.config(text=current_time)
        self.date_label.config(text=current_date)
        
        # Schedule next update in 1000ms (1 second)
        self.root.after(1000, self.update_clock)

    def run(self):
        self.update_clock()
        # Handle window close gracefully
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        self.root.mainloop()

    def on_closing(self):
        self.root.destroy()