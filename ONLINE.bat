@echo off
echo Keep START.bat running, then this opens the public API tunnel for Vercel/mobile.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\online-tunnel.ps1"
pause
