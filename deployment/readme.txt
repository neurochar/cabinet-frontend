Сбилдить локально:

docker image rm neurochar-frontend-cabinet:v1 && docker build -t neurochar-frontend-cabinet:v1 . && docker save --output ./deployment/builds/neurochar-frontend-cabinet.v1.tar neurochar-frontend-cabinet:v1

Запустить локально:

docker-compose --project-directory ./deployment up

Загрузить на сервере

docker load --input builds/neurochar-frontend-cabinet.v1.tar

Удалить все неиспользуемое

docker system prune -a

Перезапустить с обновленными образами на сервере:

docker compose up -d --force-recreate







