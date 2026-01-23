FROM python:3.9-slim

WORKDIR /app

# Dependencias del sistema (libpq para Postgres)
RUN apt-get update && apt-get install -y gcc libpq-dev netcat-openbsd git

# Copiar requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar TODO el contenido de be-fcore al contenedor
COPY . .

# Dar permisos al entrypoint
RUN chmod +x entrypoint.sh

EXPOSE 8000

# Usar el script de entrada
ENTRYPOINT ["./entrypoint.sh"]