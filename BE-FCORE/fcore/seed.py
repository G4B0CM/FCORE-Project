import logging
from datetime import datetime
from sqlalchemy.orm import Session

# --- Import components from your application ---
# Adjust the paths if your script is located elsewhere
from fcore.presentation.api.dependencies import SessionLocal, engine
from fcore.infrastructure.database.models.base_db_model import Base
from fcore.infrastructure.database.models.role_model import RoleModel
from fcore.infrastructure.database.models.analyst_model import AnalystModel
from fcore.infrastructure.security.bcrypt_password_hasher import BcryptPasswordHasher

# Configure basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def seed_database():
    """
    Populates the database with initial data for roles and an admin user.
    This function is idempotent; it won't create duplicates if run multiple times.
    """
    db: Session = SessionLocal()
    password_hasher = BcryptPasswordHasher()

    try:
        logging.info("Starting database seeding...")

        # --- 1. Create Roles ---
        roles_to_create = {
            "Admin": "Can perform all operations, including user management.",
            "Analyst": "Can manage rules and view transactions."
        }
        
        created_roles = {}
        for name, description in roles_to_create.items():
            db_rol = db.query(RoleModel).filter(RoleModel.name == name).first()
            if not db_rol:
                logging.info(f"Creating role: {name}")
                new_rol = RoleModel(name=name, description=description, is_active=True)
                db.add(new_rol)
                db.flush() # Flush to get the ID for the next step
                created_roles[name] = new_rol
            else:
                logging.info(f"Role '{name}' already exists. Skipping.")
                created_roles[name] = db_rol

        # --- 2. Create Admin Analyst ---
        admin_code = "C10000000"
        db_admin = db.query(AnalystModel).filter(AnalystModel.code == admin_code).first()

        if not db_admin:
            logging.info(f"Creating admin user with code: {admin_code}")
            
            # Make sure the Admin role was found or created
            admin_rol = created_roles.get("Admin")
            if not admin_rol:
                logging.error("Admin role not found. Cannot create admin user.")
                db.rollback()
                return

            admin_password = "AdminPassword123"
            hashed_password = password_hasher.hash(admin_password)

            new_admin = AnalystModel(
                name="Admin",
                lastname="User",
                code=admin_code,
                password_hash=hashed_password,
                role_id=admin_rol.id,
                is_active=True,
                created_at=datetime.now(),
                created_by="seed_script",
            )
            db.add(new_admin)
            
            logging.info("--- !!! IMPORTANT !!! ---")
            logging.info(f"Admin user created. Use these credentials to log in:")
            logging.info(f"  Username: {admin_code}")
            logging.info(f"  Password: {admin_password}")
            logging.info("-------------------------")
        else:
            logging.info(f"Admin user with code '{admin_code}' already exists. Skipping.")

        # --- 3. Commit all changes ---
        db.commit()
        logging.info("Database seeding finished successfully.")

    except Exception as e:
        logging.error(f"An error occurred during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # This ensures that the tables are created if they don't exist
    # before we try to seed them.
    logging.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    seed_database()