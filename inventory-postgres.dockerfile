FROM postgres:16.3-alpine3.20
# Copia el script a la imagen
COPY init-postgres.sh /docker-entrypoint-initdb.d/
# corre el script
RUN chmod +x /docker-entrypoint-initdb.d/init-postgres.sh

# docker build -t postgres-app -f postgres.dockerfile .
# docker tag postgres-app eduarandres/postgres-app:latest
# docker push eduarandres/postgres-app:latest