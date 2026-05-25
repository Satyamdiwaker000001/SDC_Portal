@echo off
SETLOCAL EnableExtensions

echo ===================================================
echo     SDC Resistance Command - Launching Portal
echo ===================================================

:: Start Frontend Dev Server
echo Starting Frontend Node server...
start "SDC Frontend" cmd /k "cd /d frontend && npm run dev"

echo.
echo Launching finished.
echo - Frontend: http://localhost:5173
echo.
echo Press any key to close this terminal...
pause > nul
