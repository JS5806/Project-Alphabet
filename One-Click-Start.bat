@echo off
TITLE Simple Tkinter Digital Clock - Deployer

echo ===================================================
echo  System Integrity Check and Application Launch
echo ===================================================

:: 1. Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python from https://www.python.org/
    pause
    exit /b
)

:: 2. Set up environment
echo [1/3] Preparing resources...
if not exist "logs" mkdir logs

:: 3. Install dependencies (if any listed in requirements.txt)
echo [2/3] Checking dependencies...
pip install -r requirements.txt

:: 4. Launch the application
echo [3/3] Launching Digital Clock...
echo ---------------------------------------------------
echo Close the clock window to stop the application.
echo ---------------------------------------------------

python frontend/clock_app.py

if %errorlevel% neq 0 (
    echo [ERROR] Application crashed. Please check logs/app_performance.log
    pause
)

exit