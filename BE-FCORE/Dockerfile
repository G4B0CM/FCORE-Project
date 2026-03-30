FROM python:3.11-slim

WORKDIR /app

# 1. Instalar dependencias del sistema (incluyendo git por si acaso)
RUN apt-get update && apt-get install -y gcc libpq-dev netcat-openbsd git

# 2. Copiar archivos de definición de dependencias
COPY requirements.txt .
COPY pyproject.toml .

# 3. Instalar dependencias externas (librerías)
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copiar el código fuente
COPY . .

# 5. Instalar NUESTRO proyecto como paquete (usando pyproject.toml)
# Esto permite hacer "import fcore" desde cualquier lado
RUN pip install --no-cache-dir .

# 6. Permisos al entrypoint
RUN chmod +x entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]