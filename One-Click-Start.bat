@echo off
chcp 65001 >nul
cls

echo ========================================================
echo  🚀 프로젝트 원클릭 실행기 (Auto-Runner)
echo ========================================================
echo.

:: 1. Node.js 프로젝트인지 확인 (package.json)
if exist "package.json" (
    echo [감지됨] Node.js 프로젝트입니다.
    echo.
    echo 1) 필요한 모듈 설치 중... (npm install)
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 설치 중 오류가 발생했습니다. Node.js가 설치되어 있는지 확인해주세요.
        pause
        exit
    )
    
    echo.
    echo 2) 프로그램 실행 중... (npm start)
    echo (브라우저가 자동으로 열립니다...)
    call npm start
    pause
    exit
)

:: 2. 파이썬 프로젝트인지 확인 (requirements.txt)
if exist "requirements.txt" (
    echo [감지됨] Python 프로젝트입니다.
    echo.
    echo 1) 가상환경 확인 및 라이브러리 설치...
    pip install -r requirements.txt
    
    echo.
    echo 2) 메인 파일 찾는 중...
    if exist "main.py" (
        python main.py
    ) else if exist "app.py" (
        python app.py
    ) else (
        echo ❌ 실행할 파이썬 파일(main.py 또는 app.py)을 찾을 수 없습니다.
    )
    pause
    exit
)

:: 3. 아무것도 못 찾았을 때
echo ❌ 실행 가능한 프로젝트 설정 파일(package.json 또는 requirements.txt)이 없습니다.
echo 폴더 안에 파일이 제대로 있는지 확인해주세요.
pause
