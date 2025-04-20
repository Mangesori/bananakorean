@echo off
echo Starting Browser Tools > "%USERPROFILE%\browser-tools-log.txt"
echo Time: %TIME% %DATE% >> "%USERPROFILE%\browser-tools-log.txt"

REM Check if port 3025 is in use and kill the process if it is
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3025') do (
    echo Killing process with PID: %%a >> "%USERPROFILE%\browser-tools-log.txt"
    taskkill /F /PID %%a
    timeout /t 2 /nobreak
)

echo Starting server... >> "%USERPROFILE%\browser-tools-log.txt"
start /b cmd /c npx @agentdeskai/browser-tools-server@1.2.0
timeout /t 2 /nobreak

echo Starting MCP... >> "%USERPROFILE%\browser-tools-log.txt"
start /b cmd /c npx @agentdeskai/browser-tools-mcp@1.2.0
echo Done! >> "%USERPROFILE%\browser-tools-log.txt" 