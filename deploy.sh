docker network create proxy-net 2>/dev/null || true

docker compose build

docker compose up -d

docker rmi $(docker images --filter "dangling=true" -q) || true
