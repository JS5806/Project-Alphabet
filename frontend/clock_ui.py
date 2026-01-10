import tkinter as tk
from backend.time_service import get_current_time_string
from database.log_service import log_tick

class ClockApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Digital Clock - Real-time")
        self.root.geometry("400x150")
        self.root.configure(bg='black')

        # UI Elements
        self.time_label = tk.Label(
            root, 
            text="00:00:00", 
            font=("Consolas", 60, "bold"), 
            bg="black", 
            fg="#00FF00"
        )
        self.time_label.pack(expand=True)

        # Start the recursive update loop
        self.update_time_loop()

    def update_time_loop(self):
        """
        Phase 3 Core Logic: Recursive update using root.after to keep UI responsive.
        """
        try:
            current_time = get_current_time_string()
            
            # Update Label
            self.time_label.config(text=current_time)
            
            # Log activity (Infra/DBA Requirement)
            log_tick(current_time)
            
            # Schedule next update in 1000ms (1 second)
            self.root.after(1000, self.update_time_loop)
        except Exception as e:
            print(f"Error updating time: {e}")