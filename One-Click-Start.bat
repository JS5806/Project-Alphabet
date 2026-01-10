@echo off
SETLOCAL EnableDelayedExpansion
title Smart Todo Management System - One Click Startup

echo ===================================================
echo [1/4] Checking Prerequisites...
echo ===================================================

node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

echo Node.js is installed.

echo.
echo ===================================================
echo [2/4] Installing Backend Dependencies...
echo ===================================================
cd backend
call npm install

echo.
echo ===================================================
echo [3/4] Installing Frontend Dependencies...
echo ===================================================
cd ../frontend
call npm install

echo.
echo ===================================================
echo [4/4] Starting System (Integrated Testing Mode)
echo ===================================================

echo Launching Backend Server...
cd ../backend
start /b npm start

echo Launching Frontend (Vite)...
cd ../frontend
start /b npm run dev -- --open

echo.
echo ===================================================
echo System is running!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ===================================================
echo Press any key to stop all services...
pause >nul

taskkill /F /IM node.exe /T
echo Services stopped.
exit