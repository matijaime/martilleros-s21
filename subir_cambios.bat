@echo off
echo ==========================================
echo       PROYECTO FACU: SUBIENDO CAMBIOS
echo ==========================================
echo.

:: 1. Agrega todos los archivos nuevos o modificados
echo Agregando archivos...
git add .

:: 2. Crea el commit con la fecha y hora actual
:: Esto evita que tengas que escribir un mensaje cada vez
echo Generando commit...
git commit -m "Entrega/Avance Facu: %date% %time%"

:: 3. Envia los cambios a tu repositorio remoto
echo.
echo Subiendo a GitHub...
git push

echo.
echo ==========================================
echo      TODO AL DIA EN EL REPO!
echo ==========================================
echo.
pause