@echo off
title Mapa de Greves - Inicializacao
cd /d "%~dp0"

echo ============================================
echo   MAPA DE GREVES - SUBINDO O AMBIENTE
echo ============================================
echo.

echo [1/4] Verificando o Docker...
docker ps >nul 2>&1
if errorlevel 1 (
    echo     Docker nao esta rodando. Abrindo o Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo     Aguardando o Docker iniciar ^(pode levar 1-2 minutos^)...
    :waitdocker
    timeout /t 5 /nobreak >nul
    docker ps >nul 2>&1
    if errorlevel 1 goto waitdocker
)
echo     Docker OK.
echo.

echo [2/4] Subindo o container do banco...
docker start grevesai-db >nul 2>&1
if errorlevel 1 (
    echo     Container nao existe. Criando...
    docker run --name grevesai-db -e POSTGRES_PASSWORD=grv2006 -e POSTGRES_DB=mapa_grevesai -p 5432:5432 -d postgres:16 >nul
    echo     Container criado. ATENCAO: rode "npx prisma db seed" para repopular.
) else (
    echo     Container iniciado.
)
echo.

echo [3/4] Aguardando o banco aceitar conexoes...
:waitdb
timeout /t 3 /nobreak >nul
docker exec grevesai-db pg_isready -U postgres >nul 2>&1
if errorlevel 1 goto waitdb
echo     Banco pronto.
echo.

echo [4/4] Abrindo o servidor e o Prisma Studio...
start "Next.js - Mapa de Greves" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 5 /nobreak >nul
start "Prisma Studio" cmd /k "cd /d %~dp0 && npx prisma studio"

echo.
echo ============================================
echo   TUDO NO AR
echo   App:    http://localhost:3000/mapa
echo   Studio: http://localhost:5555
echo ============================================
echo.
echo Feche esta janela quando quiser. Os servidores
echo continuam rodando nas janelas abertas.
timeout /t 8