@echo off
title SeniorAutoApply - Modo Debug

echo ========================================================
echo   CONFIGURANDO CHROME PARA AUTOMACAO (MODO ROBOT)
echo ========================================================
echo.
echo 1. Vou fechar todas as janelas do Chrome agora.
echo    (Isso e necessario para ativar o controle remoto)
echo.
echo 2. Em seguida, vou reabrir o Chrome automaticamente.
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

echo.
echo [1/2] Fechando Chrome...
taskkill /F /IM chrome.exe /T >nul 2>&1

echo.
echo [2/2] Reabrindo Chrome no Modo Debug...

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%LOCALAPPDATA%\Google\Chrome\User Data"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%LOCALAPPDATA%\Google\Chrome\User Data"
) else (
    echo.
    echo ERRO: Nao encontrei o Chrome em C:\Program Files.
    echo Tentando na pasta AppData...
    start "" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%LOCALAPPDATA%\Google\Chrome\User Data"
)

echo.
echo ========================================================
echo   SUCESSO! 
echo ========================================================
echo O Chrome foi reiniciado.
echo Agora voce pode usar o Dashboard e o Robo vai funcionar.
echo.
echo Pode minimizar esta janela (nao feche).
pause
