@echo off
SETLOCAL EnableDelayedExpansion

echo [1/4] Checking Prerequisites...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo [2/4] Installing Backend Dependencies...
cd backend
call npm install

echo [3/4] Installing Frontend Dependencies...
cd ../frontend
call npm install

echo [4/4] Starting Services...
start cmd /k "cd ../backend && title Backend_Server && npm start"
echo Starting Backend on port 5000...

timeout /t 5 /nobreak >nul

echo Starting Frontend on port 3000...
start cmd /k "cd ../frontend && title Frontend_App && npm run dev"

echo Waiting for services to initialize...
timeout /t 10 /nobreak >nul

start http://localhost:3000
echo System is running!
pause