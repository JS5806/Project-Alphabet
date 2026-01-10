@echo off
SETLOCAL EnableDelayedExpansion

echo ===================================================
echo   Simple Digital Clock - Lead Dev Automation
echo ===================================================

:: 1. Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.x from https://www.python.org/
    pause
    exit /b
)

echo [1/3] Python detected.

:: 2. Install dependencies (Tkinter is standard, but we ensure environment is ready)
echo [2/3] Checking environment...
:: No external pip requirements for this phase, but adding placeholder for future-proofing
:: pip install -r requirements.txt

:: 3. Run the application
echo [3/3] Launching Digital Clock...
echo ---------------------------------------------------
python main.py

if %errorlevel% neq 0 (
    echo [ERROR] Application exited with an error.
    pause
)

echo Application closed.
pause