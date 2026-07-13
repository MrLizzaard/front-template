@echo off
docker network create proxy-net >nul 2>&1

docker compose build

docker compose up -d

for /f "delims=" %%i in ('docker images --filter "dangling=true" -q') do docker rmi %%i
