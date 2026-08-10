@echo off
SETLOCAL EnableExtensions

echo ===================================================
echo     SDC Resistance Command - Launching Portal
echo ===================================================

:: Start Backend Dev Server
echo Starting Backend FastAPI server...
start "SDC Backend" cmd /k "cd /d "%~dp0backend" && .\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

:: Start Frontend Dev Server
echo Starting Frontend Node server...
start "SDC Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Launching finished.
echo - Frontend: http://localhost:5173
echo - Backend Docs: http://localhost:8000/sdc_portal/docs
echo.
echo Press any key to close this terminal...
pause > nul

