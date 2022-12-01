FROM php:8.0.0-apache

RUN docker-php-ext-install mysqli
# Include alternative DB driver
RUN apt-get update && \
    apt-get install -y libpq-dev && \
    docker-php-ext-install pdo pdo_pgsql pgsql