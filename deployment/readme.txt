Сбилдить локально:

docker image rm letit-frontend-admin:v1 && docker build -t letit-frontend-admin:v1 . && docker save --output ./deployment/builds/letit-frontend-admin.v1.tar letit-frontend-admin:v1

Запустить локально:

docker-compose --project-directory ./deployment up

Загрузить на сервере

docker load --input builds/letit-frontend-admin.v1.tar

Удалить все неиспользуемое

docker system prune -a

Перезапустить с обновленными образами на сервере:

docker compose up -d --force-recreate







