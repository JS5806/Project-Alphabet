@echo off
SETLOCAL
echo ===================================================
echo   Smart Todo Management System - One Click Start
echo ===================================================

:: 1. Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

:: 2. Install Backend Dependencies
echo [Step 1/4] Installing Backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 ( echo [ERROR] Backend install failed. && pause && exit /b )
cd ..

:: 3. Install Frontend Dependencies
echo [Step 2/4] Installing Frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 ( echo [ERROR] Frontend install failed. && pause && exit /b )
cd ..

:: 4. Start Backend Server (Background)
echo [Step 3/4] Starting Backend Server (Port 5000)...
start /B cmd /c "cd backend && node server.js"

:: 5. Start Frontend Server
echo [Step 4/4] Starting Frontend Server (Vite)...
echo The application will open in your browser automatically.
timeout /t 5
start http://localhost:5173
cd frontend && npm run dev

pause
ENDLOCAL