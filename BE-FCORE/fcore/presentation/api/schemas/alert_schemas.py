from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from ....core.entities.alert import AlertAction
from .transaction_schemas import TransactionResponse
from .analyst_schemas import AnalystResponse

class AlertResponse(BaseModel):
    id: UUID
    action: AlertAction
    ml_score: Optional[float]
    final_score: Optional[float]
    rule_hits: Optional[Dict[str, Any]]
    created_at: datetime
    
    # Enriched response for UI convenience
    transaction: Optional[TransactionResponse]
    creator: Optional[AnalystResponse] # Analyst who might have created it manually

    class Config:
        from_attributes = True