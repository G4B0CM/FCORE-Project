import sys
import os
import random
from uuid import uuid4
from datetime import datetime, timezone
from decimal import Decimal

# Aseguramos que el path del proyecto esté visible
sys.path.append(os.getcwd())

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Importamos modelos y entidades necesarias
from fcore.infrastructure.database.models.base_db_model import Base
from fcore.infrastructure.database.models.role_model import RoleModel
from fcore.infrastructure.database.models.analyst_model import AnalystModel
from fcore.infrastructure.database.models.customer_model import CustomerModel
from fcore.infrastructure.database.models.merchant_model import MerchantModel
from fcore.infrastructure.database.models.rule_model import RuleModel
from fcore.core.entities.rule import RuleSeverity
from fcore.infrastructure.security.bcrypt_password_hasher import BcryptPasswordHasher

load_dotenv()

# Configuración DB (Mismas variables que init_db.py)
DB_USER = os.getenv("POSTGRES_USER", "fcore_user")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "fcore_password")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_DB = os.getenv("POSTGRES_DB", "fcore_db")
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DB}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

def get_utc_now():
    """Helper para obtener fecha actual UTC sin warnings"""
    return datetime.now(timezone.utc)

def seed_roles_and_analyst():
    print("--- Seeding Roles & Analysts ---")
    
    # 1. Crear Roles
    admin_role = session.query(RoleModel).filter_by(name="ADMIN").first()
    if not admin_role:
        admin_role = RoleModel(id=uuid4(), name="ADMIN", description="Administrator with full access")
        session.add(admin_role)
    
    analyst_role = session.query(RoleModel).filter_by(name="ANALYST").first()
    if not analyst_role:
        analyst_role = RoleModel(id=uuid4(), name="ANALYST", description="Fraud Analyst")
        session.add(analyst_role)
    
    session.flush()

    # 2. Crear Analista Admin
    hasher = BcryptPasswordHasher()
    hashed_pw = hasher.hash("password123")
    
    admin_user = session.query(AnalystModel).filter_by(code="C0000001").first()
    if not admin_user:
        admin_user = AnalystModel(
            id=uuid4(),
            name="Super",
            lastname="Admin",
            code="C0000001",
            password_hash=hashed_pw,
            role_id=admin_role.id,
            created_at=get_utc_now(), # CORREGIDO
            created_by="SYSTEM"
        )
        session.add(admin_user)
        print(f"User Created: C0000001 / password123")
    else:
        print("Admin user already exists.")

def seed_customers():
    print("--- Seeding Customers ---")
    customers_data = [
        ("Juan Perez", "1710001000", "standard", 35, "medium"),
        ("Maria Lopez", "1720002000", "premium", 28, "low"),
        ("Carlos Fraud", "1730003000", "risky", 45, "high"),
    ]

    for name, doc, seg, age, risk in customers_data:
        if not session.query(CustomerModel).filter_by(document_number=doc).first():
            cust = CustomerModel(
                id=uuid4(),
                full_name=name,
                document_number=doc,
                segment=seg,
                age=age,
                risk_profile=risk
            )
            session.add(cust)
            print(f"Customer created: {name} (ID: {cust.id})")

def seed_merchants():
    print("--- Seeding Merchants ---")
    merchants_data = [
        ("Amazon US", "E-commerce", "low", True, False),
        ("Starbucks Quito", "Food", "low", False, False),
        ("Unknown Gambling Site", "Gambling", "high", False, False),
        ("Tech Store", "Electronics", "medium", False, False),
    ]

    for name, cat, risk, white, black in merchants_data:
        if not session.query(MerchantModel).filter_by(name=name).first():
            merch = MerchantModel(
                id=uuid4(),
                name=name,
                category=cat,
                risk_level=risk,
                is_whitelisted=white,
                is_blacklisted=black
            )
            session.add(merch)
            print(f"Merchant created: {name} (ID: {merch.id})")

def seed_rules():
    print("--- Seeding Rules ---")
    rules_data = [
        ("High Amount Transaction", "amount > 2000", RuleSeverity.HIGH),
        ("Velocity Check (4x/10m)", "tx_count_10m >= 4", RuleSeverity.HIGH),
        ("Unusual Country", "country != usual_country", RuleSeverity.MEDIUM),
    ]

    for name, dsl, severity in rules_data:
        if not session.query(RuleModel).filter_by(name=name).first():
            rule = RuleModel(
                id=uuid4(),
                name=name,
                dsl_expression=dsl,
                severity=severity,
                enabled=True,
                created_at=get_utc_now(), # CORREGIDO
                created_by="SYSTEM",      # CORREGIDO: Añadido campo obligatorio
                updated_at=get_utc_now(), # CORREGIDO
                updated_by="SYSTEM"       # CORREGIDO
            )
            session.add(rule)
            print(f"Rule created: {name}")

def main():
    try:
        seed_roles_and_analyst()
        seed_customers()
        seed_merchants()
        seed_rules()
        session.commit()
        print("\n✅ Seed completado exitosamente.")
    except Exception as e:
        session.rollback()
        print(f"\n❌ Error durante el seed: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    main()