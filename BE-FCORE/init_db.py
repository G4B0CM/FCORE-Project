import os
import time
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from fcore.infrastructure.database.models.base_db_model import Base
# Importar TODOS los modelos para que SQLAlchemy los detecte al crear tablas
from fcore.infrastructure.database.models.role_model import RoleModel
from fcore.infrastructure.database.models.analyst_model import AnalystModel
from fcore.infrastructure.database.models.customer_model import CustomerModel
from fcore.infrastructure.database.models.merchant_model import MerchantModel
from fcore.infrastructure.database.models.transaction_model import TransactionModel
from fcore.infrastructure.database.models.behavior_profile_model import BehaviorProfileModel
from fcore.infrastructure.database.models.rule_model import RuleModel
from fcore.infrastructure.database.models.alert_model import AlertModel
from fcore.infrastructure.database.models.case_model import CaseModel

load_dotenv()

# Configuración igual a dependencies.py
DB_USER = os.getenv("POSTGRES_USER", "fcore_user")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "fcore_password")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "fcore_db")

# Cadena de conexión para PostgreSQL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

def wait_for_db(engine):
    """Espera a que la base de datos esté lista (útil para docker-compose)."""
    retries = 5
    while retries > 0:
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("Base de datos conectada exitosamente.")
            return
        except OperationalError:
            print("Base de datos no lista, reintentando en 2s...")
            time.sleep(2)
            retries -= 1
    raise Exception("No se pudo conectar a la base de datos.")

def init_db():
    print("Inicializando base de datos...")
    engine = create_engine(DATABASE_URL)
    wait_for_db(engine)

    with engine.connect() as conn:
        # 1. Habilitar la extensión TimescaleDB (si no existe)
        print("Habilitando extension TimescaleDB...")
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;"))
        conn.commit()

    # 2. Crear las tablas normales (SQLAlchemy)
    print("Creando tablas estandar...")
    Base.metadata.create_all(bind=engine)

    # 3. Convertir 'transactions' en Hypertable
    # Esto es crucial para el rendimiento de series temporales
    with engine.connect() as conn:
        print("Convirtiendo 'transactions' a Hypertable...")
        try:
            # Solo intentamos convertirla si no es ya una hypertable.
            # La función create_hypertable falla si la tabla ya tiene datos o ya es hypertable,
            # así que usamos 'if_not_exists => TRUE' (disponible en versiones recientes)
            # o manejamos la excepción. Para simplificar, usaremos el comando estándar
            # asumiendo una DB limpia o usando 'IF NOT EXISTS' si la versión lo permite.
            
            # Nota: 'migrate_data=True' permite convertirla aunque tenga datos (si la tabla es simple)
            conn.execute(text("SELECT create_hypertable('transactions', 'occurred_at', if_not_exists => TRUE, migrate_data => TRUE);"))
            conn.commit()
            print("¡Tabla 'transactions' convertida a Hypertable exitosamente!")
        except Exception as e:
            print(f"Nota sobre Hypertable: {e}")
            # Ignoramos si ya es hypertable

    print("Inicializacion completada.")

if __name__ == "__main__":
    init_db()