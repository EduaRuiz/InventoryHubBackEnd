#!/bin/bash
set -e

# Función para crear una base de datos si no existe
create_database() {
    local database=$1
    echo "Checking if database '$database' exists..."

    if psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tc "SELECT 1 FROM pg_database WHERE datname = '$database'" | grep -q 1; then
        echo "Database '$database' already exists."
    else
        echo "Creating database '$database'..."
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        CREATE DATABASE $database;
EOSQL
    fi
}

# Función para crear un usuario si no existe
create_user() {
    local user=$1
    local password=$2
    echo "Checking if user '$user' exists..."

    if psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tc "SELECT 1 FROM pg_roles WHERE rolname = '$user'" | grep -q 1; then
        echo "User '$user' already exists."
        return 1
    else
        echo "Creating user '$user'..."
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        CREATE USER $user WITH ENCRYPTED PASSWORD '$password';
EOSQL
        return 0
    fi
}

# Función para otorgar privilegios a un usuario en una base de datos
grant_privileges() {
    local database=$1
    local user=$2
    echo "Granting privileges on database '$database' to user '$user'..."

    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$database" <<-EOSQL
    GRANT ALL PRIVILEGES ON DATABASE $database TO $user;
    GRANT USAGE ON SCHEMA public TO $user;
    GRANT ALL PRIVILEGES ON SCHEMA public TO $user;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $user;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $user;
    GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $user;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO $user;
EOSQL
}

# Leer las variables de entorno y dividirlas en matrices
echo "Creating databases and users..."
IFS=',' read -ra DB_ARRAY <<<"$POSTGRES_MULTIPLE_DATABASES"
IFS=',' read -ra USER_ARRAY <<<"$POSTGRES_MULTIPLE_USERS"
IFS=',' read -ra PASS_ARRAY <<<"$POSTGRES_MULTIPLE_PASSWORDS"

# Verificar si se definieron las variables de entorno
if [ -z "$POSTGRES_MULTIPLE_DATABASES" ] || [ -z "$POSTGRES_MULTIPLE_USERS" ] || [ -z "$POSTGRES_MULTIPLE_PASSWORDS" ]; then
    echo "Error: Environment variables POSTGRES_MULTIPLE_DATABASES, POSTGRES_MULTIPLE_USERS, and POSTGRES_MULTIPLE_PASSWORDS must be set."
    exit 1
fi

echo "Databases: ${DB_ARRAY[@]}"
echo "Users: ${USER_ARRAY[@]}"
echo "Passwords: ${PASS_ARRAY[@]}"

# Verificar si el número de bases de datos, usuarios y contraseñas coincide
if [ ${#DB_ARRAY[@]} -ne ${#USER_ARRAY[@]} ] || [ ${#USER_ARRAY[@]} -ne ${#PASS_ARRAY[@]} ]; then
    echo "Error: Number of databases, users, and passwords must match."
    exit 1
fi

# Crear bases de datos y usuarios
for i in "${!DB_ARRAY[@]}"; do
    create_database "${DB_ARRAY[$i]}"
    create_user "${USER_ARRAY[$i]}" "${PASS_ARRAY[$i]}"
    r=$?
    if [ $r -eq 0 ]; then
        grant_privileges "${DB_ARRAY[$i]}" "${USER_ARRAY[$i]}"
    fi
done
