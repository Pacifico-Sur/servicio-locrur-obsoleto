FROM php:8.0.0-apache

RUN docker-php-ext-install mysqli
# Include alternative DB driver
RUN apt-get update -qq && \
    apt-get install --yes --no-install-recommends \ 
    docker-php-ext-install pdo pdo_pgsql pgsql \ 
    libpq-dev \
    libgdal-dev \ 
    libudunits2-dev \ 
    libgdal-dev \ 
    libgeos-dev \ 
    libproj-dev \ 
    libfontconfig1-dev \ 
    libxml2-dev \ 
    libcairo2-dev \  
    libssh2-1-dev \ 
    libcurl4-openssl-dev \ 
    libssl-dev
# update system libraries
RUN apt-get update && \ 
  apt-get upgrade -y && \ 
  apt-get clean
# Para ejecutar scripts de R usando Nodejs
RUN apt-get install --yes r-base
RUN apt-get install --yes curl
# get install script and pass it to execute: 
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash
# and install node 
RUN apt-get install -y git-core curl build-essential openssl libssl-dev \
 && git clone https://github.com/nodejs/node.git \
 && cd node \
 && ./configure \
 && make \
 && make install
RUN echo "Node: " && node -v
RUN echo "NPM: " && npm -v
RUN npm install r-integration

RUN R -e "install.packages(c('DBI', 'dplyr', 'ggplot2', 'magrittr', 'remotes', 'sf'), dependencies = TRUE)"
