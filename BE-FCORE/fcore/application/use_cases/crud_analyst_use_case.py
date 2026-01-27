from typing import List, Optional
from datetime import datetime
from uuid import UUID

from ...core.entities.analyst import Analyst
from ..interfaces.i_unit_of_work import IUnitOfWork # Dependency on UoW
from ..interfaces.i_password_hasher import IPasswordHasher
from ...core.errors.analyst_errors import AnalystAlreadyExistsError, AnalystNotFoundError
from ...core.errors.roles_errors import RoleNotFoundError
from ...presentation.api.schemas.analyst_schemas import AnalystCreate, AnalystUpdate

class CrudAnalystUseCase:
    """Use case for CRUD operations on an Analyst using Unit of Work."""
    
    def __init__(
        self, 
        uow: IUnitOfWork, 
        password_service: IPasswordHasher
    ):
        self._uow = uow
        self._password_hasher = password_service

    def create(self, analyst_schema: AnalystCreate, created_by_code: str) -> Analyst:
        """
        Orchestrates the creation of a new analyst within a transaction.
        """
        with self._uow:
            # 1. Validation Logic
            if self._uow.analyst_repository.find_by_code(analyst_schema.code):
                raise AnalystAlreadyExistsError(f"Analyst with code {analyst_schema.code} already exists.")

            role_entity = self._uow.role_repository.find_by_id(analyst_schema.role_id)
            if not role_entity or not role_entity.is_active:
                raise RoleNotFoundError(f"Role with ID {analyst_schema.role_id} not found or is inactive.")

            # 2. Business Logic
            password_hash = self._password_hasher.hash(analyst_schema.password)
            new_analyst = Analyst(
                name=analyst_schema.name,
                lastname=analyst_schema.lastname,
                code=analyst_schema.code,
                password_hash=password_hash,
                role=role_entity,
                created_at=datetime.utcnow(),
                created_by=created_by_code
            )
            
            # 3. Persistence
            created_analyst = self._uow.analyst_repository.create(new_analyst)
            self._uow.commit() # Atomic Commit
            
            return created_analyst

    def get_all(self) -> List[Analyst]:
        """Gets all analysts (Read-only operation)."""
        with self._uow:
            return self._uow.analyst_repository.get_all()

    def get_by_code(self, code: str) -> Analyst:
        with self._uow:
            analyst = self._uow.analyst_repository.find_by_code(code=code)
            if not analyst:
                raise AnalystNotFoundError(f"Analyst with code {code} not found.")
            return analyst

    def get_by_id(self, id: UUID) -> Analyst:
        with self._uow:
            analyst = self._uow.analyst_repository.find_by_id(id=id)
            if not analyst:
                raise AnalystNotFoundError(f"Analyst with ID {id} not found.")
            return analyst

    def update(self, code: str, analyst_schema: AnalystUpdate, modified_by_code: str) -> Analyst:
        with self._uow:
            analyst_to_update = self._uow.analyst_repository.find_by_code(code)
            if not analyst_to_update:
                raise AnalystNotFoundError(f"Analyst with code {code} not found.")

            if analyst_schema.name is not None:
                analyst_to_update.name = analyst_schema.name
            if analyst_schema.lastname is not None:
                analyst_to_update.lastname = analyst_schema.lastname
            
            if analyst_schema.role_id is not None:
                new_role = self._uow.role_repository.find_by_id(analyst_schema.role_id)
                if not new_role or not new_role.is_active:
                    raise RoleNotFoundError(f"Role with ID {analyst_schema.role_id} not found or is inactive.")
                analyst_to_update.role = new_role
            
            analyst_to_update.updated_at = datetime.utcnow()
            analyst_to_update.updated_by = modified_by_code
            analyst_to_update.__post_init__()

            updated_analyst = self._uow.analyst_repository.update(analyst_to_update)
            self._uow.commit()
            return updated_analyst
    
    def deactivate(self, code: str, modified_by_code: str) -> Analyst:
        with self._uow:
            analyst = self._uow.analyst_repository.find_by_code(code)
            if not analyst:
                raise AnalystNotFoundError(f"Analyst with code {code} not found.")
            
            analyst.deactivate()
            analyst.updated_at = datetime.utcnow()
            analyst.updated_by = modified_by_code
            
            result = self._uow.analyst_repository.update(analyst)
            self._uow.commit()
            return result