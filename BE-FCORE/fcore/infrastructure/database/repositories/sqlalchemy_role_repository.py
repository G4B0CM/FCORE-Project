from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session

from ....core.entities.role import Role
from ....application.interfaces.i_role_repository import IRoleRepository
from ..models.role_model import RoleModel

class SqlAlchemyRoleRepository(IRoleRepository):
    def __init__(self, session: Session):
        self._session = session

    def create(self, role: Role) -> Role:
        new_role_model = RoleModel.from_entity(role)
        self._session.add(new_role_model)
        self._session.flush()
        return new_role_model.to_entity()

    def find_by_id(self, id: UUID) -> Optional[Role]:
        role_model = self._session.query(RoleModel).filter_by(id=id).first()
        return role_model.to_entity() if role_model else None

    def find_by_name(self, name: str) -> Optional[Role]:
        role_model = self._session.query(RoleModel).filter_by(name=name).first()
        return role_model.to_entity() if role_model else None

    def get_all(self) -> List[Role]:
        all_role_models = self._session.query(RoleModel).all()
        return [model.to_entity() for model in all_role_models]

    def update(self, role: Role) -> Role:
        role_model = self._session.query(RoleModel).filter_by(id=role.id).first()
        if not role_model:
            return None 
        role_model.name = role.name
        role_model.description = role.description
        role_model.is_active = role.is_active
        self._session.flush()
        return role_model.to_entity()

    def delete(self, id: UUID) -> bool:
        role_model = self._session.query(RoleModel).filter_by(id=id).first()
        if not role_model:
            return False
        
        self._session.delete(role_model)
        self._session.flush()
        return True