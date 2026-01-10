@echo off
SETLOCAL EnableDelayedExpansion
title Smart Todo Management System - Setup & Start

echo [1/4] Checking Prerequisites...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)
echo Node.js is installed.

echo [2/4] Installing Root Dependencies...
call npm install

echo [3/4] Installing Backend and Frontend Dependencies...
cd backend && call npm install && cd ..
cd frontend && call npm install && cd ..

echo [4/4] Starting the Application...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:5173

:: Start the application in a new window
start "Smart Todo Server" cmd /c "npm start"

:: Wait a few seconds for server to initialize
timeout /t 5 /nobreak >nul

:: Open browser
start http://localhost:5173

echo Application is running. Close the other command window to stop the server.
pause