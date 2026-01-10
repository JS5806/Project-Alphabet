@echo off
SETLOCAL EnableDelayedExpansion

echo [1/3] Checking Python Installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH.
    echo Please install Python from https://www.python.org/
    pause
    exit /b
)

echo [2/3] Setting up Virtual Environment and Dependencies...
if not exist "venv" (
    python -m venv venv
)

call venv\Scripts\activate

if exist "requirements.txt" (
    python -m pip install --upgrade pip
    pip install -r requirements.txt
)

echo [3/3] Starting Simple Digital Clock...
python main.py

if %errorlevel% neq 0 (
    echo.
    echo Application crashed. Please check the logs.
    pause
)

deactivate