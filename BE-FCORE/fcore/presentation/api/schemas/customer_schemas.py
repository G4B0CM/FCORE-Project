from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class CustomerBase(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=200)
    document_number: str = Field(...,pattern=r"\d{10}", min_length=5, max_length=50)
    segment: Optional[str] = Field(None, max_length=50)
    age: Optional[int] = Field(None, ge=18, le=100)

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=3, max_length=200)
    document_number: Optional[str] = Field(None, min_length=5, max_length=50)
    segment: Optional[str] = Field(None, max_length=50)
    age: Optional[int] = Field(None, ge=18, le=100)
    risk_profile: Optional[str] = Field(None, max_length=50)

class CustomerResponse(CustomerBase):
    id: UUID
    risk_profile: str

    class Config:
        from_attributes = True