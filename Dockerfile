FROM php:8.0.0-apache

# Incluye los drivers para conectarse con la base de datos de PostgreSQL
RUN apt-get update && \
    apt-get install --yes libpq-dev && \
    docker-php-ext-install pdo pdo_pgsql pgsql
# Librerías para manejo de datos espaciales
RUN apt-get install --yes \
    libgdal-dev \
    libgeos-dev \
    libgeos++-dev \
    # La librería libssl-dev instala el paquete sf de R
    libssl-dev \
    libudunits2-dev \
    libproj-dev \
    # Librería para poder instalar en R el paquete basemaps
    libmagick++-dev 
# Instala R base para poder ejecutar scripts de R
RUN apt-get install --yes r-base
# Instala librerías necesarias para trabajar con datos espaciales y bases de datos en PostgreSQL
RUN R -e "install.packages(c('DBI', 'ggplot2', 'RPostgres', 'remotes', 'basemaps'), dependencies = TRUE)"
RUN R -e "remotes::install_gitlab('davidmacer/ipa')"
