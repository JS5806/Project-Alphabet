@echo off
title Smart Todo Management System - One Click Starter

echo [1/5] Checking Prerequisites...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo [2/5] Installing Backend Dependencies...
cd backend
call npm install

echo [3/5] Installing Frontend Dependencies...
cd ../frontend
call npm install

echo [4/5] Starting Servers...
cd ..
start cmd /k "echo Backend Server Starting... && cd backend && npm start"
start cmd /k "echo Frontend Application Starting... && cd frontend && npm start"

echo [5/5] Launching Application...
timeout /t 10 /nobreak
start http://localhost:3000

echo System is running!
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:3000
pause