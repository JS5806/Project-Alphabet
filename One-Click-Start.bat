@echo off
SETLOCAL EnableDelayedExpansion

echo [1/4] Checking Prerequisites...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

echo [2/4] Installing Dependencies (This may take a minute)...
echo Installing Backend dependencies...
cd backend
call npm install

echo Installing Frontend dependencies...
cd ../frontend
call npm install

echo [3/4] Starting Services...
cd ..
start "SmartFarm-Backend" cmd /c "cd backend && npm start"
echo Waiting for backend to initialize...
timeout /t 5

start "SmartFarm-Frontend" cmd /c "cd frontend && npm start"

echo [4/4] Launching Dashboard...
timeout /t 10
start http://localhost:3000

echo System is running!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause