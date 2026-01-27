import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from uuid import uuid4
from datetime import datetime

# Importamos las implementaciones reales y modelos
from fcore.infrastructure.database.models.base_db_model import Base
from fcore.infrastructure.database.unit_of_work import SqlAlchemyUnitOfWork
from fcore.core.entities.role import Role
from fcore.core.entities.analyst import Analyst

# --- Setup de Base de Datos en Memoria ---
@pytest.fixture(scope="function")
def session_factory():
    """
    Crea una base de datos SQLite en memoria para cada test.
    """
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(engine)
    
    # Creamos el factory
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    return TestingSessionLocal

@pytest.fixture
def uow(session_factory):
    return SqlAlchemyUnitOfWork(session_factory)

def test_uow_commit_persists_changes(uow, session_factory):
    new_role = Role(
        id=uuid4(),
        name="INTEGRATION_TEST_ROLE",
        description="Role for testing commit",
        is_active=True
    )

    with uow:
        uow.role_repository.create(new_role)
        uow.commit()

    verify_session = session_factory()
    roles = verify_session.query(Base.metadata.tables['roles']).filter_by(name="INTEGRATION_TEST_ROLE").all()
    verify_session.close()

    assert len(roles) == 1
    assert roles[0].name == "INTEGRATION_TEST_ROLE"

def test_uow_rollback_on_exception(uow, session_factory):
    
    new_role = Role(
        id=uuid4(),
        name="ROLLBACK_ROLE",
        description="Should not exist",
        is_active=True
    )

    try:
        with uow:
            uow.role_repository.create(new_role)
            raise ValueError("Something went wrong!")
    except ValueError:
        pass

    verify_session = session_factory()
    roles = verify_session.query(Base.metadata.tables['roles']).filter_by(name="ROLLBACK_ROLE").all()
    verify_session.close()

    assert len(roles) == 0

def test_uow_manual_rollback(uow, session_factory):

    new_role = Role(
        id=uuid4(),
        name="MANUAL_ROLLBACK",
        description="Testing manual rollback",
        is_active=True
    )

    with uow:
        uow.role_repository.create(new_role)
        uow.rollback()

    verify_session = session_factory()
    roles = verify_session.query(Base.metadata.tables['roles']).filter_by(name="MANUAL_ROLLBACK").all()
    verify_session.close()

    assert len(roles) == 0