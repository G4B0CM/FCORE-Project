# File: fcore/infrastructure/database/models/role_model.py
from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from uuid import uuid4

from ....core.entities.role import Role
from .base_db_model import Base, UUID_CHAR

class RoleModel(Base):
    __tablename__ = 'roles'

    id = Column(UUID_CHAR, primary_key=True, default=uuid4)
    name = Column(String(50), nullable=False, unique=True, index=True)
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    analysts = relationship("AnalystModel", back_populates="role")

    def to_entity(self) -> Role:
        """Converts the database model to a domain entity."""
        return Role(
            id=self.id,
            name=self.name,
            description=self.description,
            is_active=self.is_active
        )

    @staticmethod
    def from_entity(role: Role) -> "RoleModel":
        """Converts a domain entity to a database model."""
        return RoleModel(
            id=role.id,
            name=role.name,
            description=role.description,
            is_active=role.is_active
        )