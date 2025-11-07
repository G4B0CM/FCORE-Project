from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class MerchantBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    category: str = Field(..., min_length=3, max_length=100)

class MerchantCreate(MerchantBase):
    pass

class MerchantUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    category: Optional[str] = Field(None, min_length=3, max_length=100)
    risk_level: Optional[str] = Field(None, max_length=50)
    is_whitelisted: Optional[bool] = None
    is_blacklisted: Optional[bool] = None

class MerchantResponse(MerchantBase):
    id: UUID
    risk_level: str
    is_whitelisted: bool
    is_blacklisted: bool

    class Config:
        from_attributes = True