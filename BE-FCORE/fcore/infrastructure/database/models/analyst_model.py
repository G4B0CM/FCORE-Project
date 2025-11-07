from sqlalchemy import (
    Column, String, Boolean, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from uuid import uuid4

from ....core.entities.analyst import Analyst
from .base_db_model import Base, UUID_CHAR
from .role_model import RoleModel

class AnalystModel(Base):
    __tablename__ = 'analysts'

    id = Column(UUID_CHAR, primary_key=True, default=uuid4)
    name = Column(String(100), nullable=False)
    lastname = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    code = Column(String(20), nullable=False, unique=True, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    role_id = Column(UUID_CHAR, ForeignKey('roles.id'), nullable=False)
    
    created_at = Column(DateTime, nullable=False)
    created_by = Column(String(100), nullable=False)
    updated_at = Column(DateTime, nullable=True)
    updated_by = Column(String(100), nullable=True)

    role = relationship("RoleModel", back_populates="analysts")
    
    def to_entity(self) -> Analyst:
        analist = Analyst(
            id=self.id,
            name=self.name,
            lastname=self.lastname,
            password_hash=self.password_hash,
            code=self.code,
            is_active=self.is_active,
            role=self.role.to_entity() if self.role else None,
            created_at=self.created_at,
            created_by=self.created_by
        )
        analist.updated_at = self.updated_at
        analist.updated_by = self.updated_by
        return analist
        
    @staticmethod
    def from_entity(analyst: Analyst) -> "AnalystModel":
        return AnalystModel(
            id=analyst.id,
            name=analyst.name,
            lastname=analyst.lastname,
            password_hash=analyst.password_hash,
            code=analyst.code,
            is_active=analyst.is_active,
            role_id=analyst.role.id,
            created_at=analyst.created_at,
            created_by=analyst.created_by,
            updated_at=analyst.updated_at,
            updated_by=analyst.updated_by
        )