@echo off
SETLOCAL EnableDelayedExpansion

echo [QuickLink MVP] Checking dependencies...

:: 1. Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo [QuickLink MVP] Installing Backend Dependencies...
cd backend
call npm install

echo [QuickLink MVP] Installing Frontend Dependencies...
cd ../frontend
call npm install

echo [QuickLink MVP] Starting Services...

:: Start Backend in a new window
start /B cmd /c "cd ../backend && npm start"

:: Start Frontend
echo [QuickLink MVP] Application starting at http://localhost:3000
call npm start

pause