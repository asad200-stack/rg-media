@echo off
echo.
echo === RG Media - Deploy API Online ===
echo.
echo Web app is live on Vercel.
echo To finish setup, deploy the API + database on Render:
echo.
echo 1. Push this folder to GitHub
echo 2. Open https://dashboard.render.com/blueprints
echo 3. New Blueprint Instance - connect your repo
echo 4. Render reads render.yaml and creates API + DB + Web
echo.
echo Or run START.bat locally and use http://localhost:3000
echo.
start https://dashboard.render.com/blueprints
pause
