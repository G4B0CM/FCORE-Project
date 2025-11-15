from uuid import UUID
from pydantic import BaseModel, Field
from .role_schemas import RoleResponse

class AnalystBase(BaseModel):
    code: str = Field(..., pattern=r"^C\d{7,8}$")
    name: str = Field(..., min_length=1)
    lastname: str = Field(..., min_length=1)
    
class AnalystCreate(AnalystBase):
    password: str = Field(..., min_length=8)
    role_id: UUID

class AnalystUpdate(BaseModel):
    name: str | None = None
    lastname: str | None = None
    role_id: UUID | None = None

class AnalystResponse(AnalystBase):
    id: UUID
    is_active: bool
    role: RoleResponse

    class Config:
        from_attributes = True

class AnalystLogin(BaseModel):
    username : str = Field(...,pattern=r"^C\d{7,8}$")
    password : str