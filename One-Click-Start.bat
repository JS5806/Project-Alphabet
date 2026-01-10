@echo off
SETLOCAL EnableDelayedExpansion
title QuickLink MVP - Admin Dashboard Starter

echo [1/5] Checking Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

echo [2/5] Installing Backend dependencies...
cd backend
call npm install

echo [3/5] Installing Frontend dependencies...
cd ../frontend
call npm install

echo [4/5] Starting Backend Server in a new window...
cd ../backend
start "QuickLink_Backend" cmd /k "npm start"

echo [5/5] Starting Frontend and Opening Browser...
cd ../frontend
start "QuickLink_Frontend" cmd /k "npm run dev"

echo.
echo =====================================================
echo QuickLink Admin Dashboard is starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo =====================================================
echo.
pause