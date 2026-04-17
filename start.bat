@echo off
SETLOCAL EnableExtensions

echo ==========================================
echo    SDC Portal - Launching Services
echo ==========================================

:: Start Backend
echo Starting API Backend...
start "SDC Backend" cmd /k "cd /d backend && .\venv\Scripts\python -m uvicorn app.main:app --reload"

:: Start Frontend
echo Starting Frontend Development Server...
start "SDC Frontend" cmd /k "cd /d frontend && npm run dev"

echo.
echo All services are launching in separate windows.
echo - Backend: http://127.0.0.1:8000
echo - Frontend: Check the frontend window for the URL (usually http://localhost:5173)
echo.
echo Press any key to exit this launcher...
pause > nul
