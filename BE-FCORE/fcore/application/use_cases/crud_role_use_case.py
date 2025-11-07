from typing import List
from uuid import UUID
from ...core.entities.role import Role
from ..interfaces.i_role_repository import IRoleRepository
from ...core.errors.roles_errors import RoleNotFoundError, RoleAlreadyExistsError

class CrudRoleUseCase:
    def __init__(self, role_repository: IRoleRepository):
        self._role_repository = role_repository

    def create(self, name: str, description: str) -> Role:
        # The repository will now raise the AlreadyExistsError
        new_role_entity = Role(name=name, description=description)
        return self._role_repository.create(new_role_entity)

    def get_by_id(self, id: UUID) -> Role:
        role = self._role_repository.find_by_id(id)
        if not role:
            raise RoleNotFoundError(f"Role with ID {id} not found.")
        return role

    def get_all(self) -> List[Role]:
        return self._role_repository.get_all()

    def update(self, id: UUID, name: str, description: str, is_active: bool) -> Role:
        role_to_update = self.get_by_id(id)
        
        existing_role = self._role_repository.find_by_name(name)
        if existing_role and existing_role.id != id:
            raise RoleAlreadyExistsError(f"A role with name '{name}' already exists.")

        role_to_update.name = name
        role_to_update.description = description
        role_to_update.is_active = is_active
        
        role_to_update.__post_init__()
        
        return self._role_repository.update(role_to_update)

    def delete(self, id: UUID) -> bool:
        if not self._role_repository.find_by_id(id):
              raise RoleNotFoundError(f"Role with ID {id} not found.")
        return self._role_repository.delete(id)