from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional

class RoleBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    description: Optional[str] = Field(None, max_length=255)

class RoleCreate(RoleBase):
    pass

class RoleUpdate(RoleBase):
    is_active: bool = Field(True)

class RoleResponse(RoleBase):
    id: UUID
    is_active: bool

    class Config:
        from_attributes = True