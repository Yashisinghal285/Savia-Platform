@echo off
TITLE Savia Pediatric Platform Launcher
COLOR 0B

echo ================================================================
echo       SAVIA: MULTI-AGENT PEDIATRIC HEALTH COMPANION
echo ================================================================
echo.
echo [1/2] Starting Savia Autonomous AI Agent Service on port 8000...
start "Savia AI Agent Service (FastAPI)" cmd /k "cd /d %~dp0savia-agent-service && python run.py"

echo [2/2] Starting Savia Web Interface on port 3000...
start "Savia Web Interface (Vite)" cmd /k "cd /d %~dp0savia-frontend && npm run dev"

echo.
echo ================================================================
echo   Services Launched Successfully!
echo.
echo   - AI Agent Backend : http://127.0.0.1:8000
echo   - AI OpenAPI Docs  : http://127.0.0.1:8000/docs
echo   - Web Frontend     : http://localhost:3000
echo ================================================================
echo.
pause
