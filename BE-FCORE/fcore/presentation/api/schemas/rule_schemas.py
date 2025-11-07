from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from ....core.entities.rule import RuleSeverity

class RuleBase(BaseModel):
    name: str = Field(..., min_length=5, max_length=150)
    dsl_expression: str = Field(..., min_length=10, max_length=1024)
    severity: RuleSeverity

class RuleCreate(RuleBase):
    pass

class RuleUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=5, max_length=150)
    dsl_expression: Optional[str] = Field(None, min_length=10, max_length=1024)
    severity: Optional[RuleSeverity] = None
    enabled: Optional[bool] = None

class RuleResponse(RuleBase):
    id: UUID
    enabled: bool
    created_at: datetime
    created_by: str
    updated_at: Optional[datetime] | None = None
    updated_by: str | None = None

    class Config:
        from_attributes = True