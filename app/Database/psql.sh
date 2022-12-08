#!/bin/bash
set -e

createdb -U postgres siclr_db
pg_restore -U postgres -d siclr_db /docker-entrypoint-initdb.d/siclr_db_respaldo.tar