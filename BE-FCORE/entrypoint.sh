#!/bin/bash
set -e

echo "🚀 [Backend] Iniciando contenedor..."

# Esperar a que la DB arranque (opcional si usas healthcheck en compose, pero seguro tenerlo)
# Ejecutar inicialización de DB
echo "🛠️ [Backend] Inicializando Base de Datos..."
# Aseguramos que python pueda importar el paquete 'fcore' estando en /app
export PYTHONPATH=$PYTHONPATH:/app

# Ejecutamos tus scripts de seed (ajusta los nombres si cambian)
# Si init_db.py está dentro de fcore/..., ajusta la ruta. 
# Asumo que copiaste los scripts a la raíz de /app en el Dockerfile
if [ -f "init_db.py" ]; then
    python init_db.py
fi

if [ -f "seed_data.py" ]; then
    python seed_data.py
fi

# Iniciar Uvicorn
echo "🔥 [Backend] Arrancando servidor..."
# Importante: Como tu main.py está en fcore/presentation/api/main.py
exec uvicorn fcore.main:app --host 0.0.0.0 --port 8000