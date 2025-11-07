from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from ....core.entities.case import CaseDecision
from .alert_schemas import AlertResponse
from .analyst_schemas import AnalystResponse

class CaseOpen(BaseModel):
    alert_id: UUID

class CaseAddNote(BaseModel):
    note: str = Field(..., min_length=5)

class CaseResolve(BaseModel):
    decision: CaseDecision

class CaseResponse(BaseModel):
    id: UUID
    decision: CaseDecision
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    # Enriched response
    alert: Optional[AlertResponse]
    analyst: Optional[AnalystResponse]

    class Config:
        from_attributes = True