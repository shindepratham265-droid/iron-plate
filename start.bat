@echo off
title IronPlate — AI Backend Launcher
color 0A

echo.
echo  ============================================================
echo   IRONPLATE — AI-Powered Fitness Platform
echo   Starting Python backend (Groq LLaMA 3)
echo  ============================================================
echo.

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Python is not installed or not in PATH.
    echo  Please install Python 3.9+ from https://python.org
    pause
    exit /b 1
)

:: Move to backend folder
cd /d "%~dp0backend"

:: Install dependencies silently
echo  [1/3] Installing Python dependencies...
pip install -q -r requirements.txt
if %errorlevel% neq 0 (
    echo  [ERROR] Failed to install dependencies. Check your internet connection.
    pause
    exit /b 1
)
echo  [1/3] Dependencies ready!

echo.
echo  [2/3] Starting Flask backend on http://localhost:5000 ...
echo.
echo  ============================================================
echo   KEEP THIS WINDOW OPEN while using IronPlate Diet Plan.
echo   Press Ctrl+C to stop the server.
echo  ============================================================
echo.

:: Start Flask
python app.py
pause
