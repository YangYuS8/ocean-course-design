FROM php:8.4-cli-alpine

WORKDIR /app

RUN apk add --no-cache git unzip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

EXPOSE 8000

CMD ["sh", "docker/start-backend.sh"]
