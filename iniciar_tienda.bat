@echo off
cd /d "C:\Users\Yamu\Desktop\mi tienda\mi-tienda"

REM Ejecuta Python sin consola
start "" pythonw automatizar_final.py

REM Inicia Vite minimizado y abre navegador
start "" /min cmd /c "npm run dev -- --open"
