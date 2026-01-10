@echo off
SETLOCAL EnableDelayedExpansion

echo [System] Checking requirements...

:: Check Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [Error] Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

echo [System] Installing Backend dependencies...
cd backend
call npm install

echo [System] Installing Frontend dependencies...
cd ../frontend
call npm install

echo [System] Starting Backend Server...
cd ../backend
start "Backend Server" cmd /c "node server.js"

echo [System] Starting Frontend Development Server...
cd ../frontend
start "Frontend Client" cmd /c "npm run dev"

echo [System] Waiting for servers to initialize...
timeout /t 5

echo [System] Opening browser to application...
start http://localhost:5173

echo [Success] System is running.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
pause