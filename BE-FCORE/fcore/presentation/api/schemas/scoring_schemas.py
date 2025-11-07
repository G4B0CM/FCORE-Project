from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID
from ....core.entities.alert import AlertAction

class ScoringResponse(BaseModel):
    transaction_id: UUID
    action: AlertAction
    ml_score: float
    final_score: float
    rule_hits: List[Dict[str, Any]]