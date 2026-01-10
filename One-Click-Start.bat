@echo off
SETLOCAL EnableDelayedExpansion

echo [Step 1] Checking Environment...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo [Step 2] Installing Dependencies (This may take a moment)...
call npm install
cd frontend
call npm install
cd ../backend
call npm install
cd ..

echo [Step 3] Launching Digital Clock (UI/UX Phase 2)...
start http://localhost:5173
npm start