FROM php:8.0.0-apache

# Incluye los drivers para conectarse con la base de datos de PostgreSQL
RUN apt-get update && \
    apt-get install --yes libpq-dev && \
    docker-php-ext-install pdo pdo_pgsql pgsql
