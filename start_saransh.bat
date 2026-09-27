@echo off
title Saransh - AI Healthcare Triage Assistant (Launcher)
color 0A

echo =====================================================================
echo           SARANSH (सारांश) - BPUT HACKATHON 2026 LAUNCHER
echo     Multimodal Human-in-the-Loop Healthcare Triage Assistant
echo =====================================================================
echo.

cd /d "C:\Users\AMITRAZ\OneDrive\Desktop\Saransh"

echo [1/3] Starting FastAPI Backend on http://localhost:8000...
start "Saransh Backend (FastAPI)" cmd /k "cd /d C:\Users\AMITRAZ\OneDrive\Desktop\Saransh && python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Waiting for backend initialization...
timeout /t 3 /nobreak > nul

echo [3/3] Starting React Frontend on http://localhost:5173...
start "Saransh Frontend (Vite)" cmd /k "cd /d C:\Users\AMITRAZ\OneDrive\Desktop\Saransh\frontend && npm run dev"

echo.
echo Waiting for frontend server to spin up...
timeout /t 3 /nobreak > nul

echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo.
echo =====================================================================
echo   SUCCESS! Saransh is now running:
echo   - Frontend: http://localhost:5173
echo   - Backend Docs: http://localhost:8000/docs
echo   - Pitch Deck: C:\Users\AMITRAZ\OneDrive\Desktop\Saransh_Pitch_Deck.html
echo =====================================================================
echo.
pause
