import enum
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID, uuid4

from .transaction import Transaction
from .analyst import Analyst
from .rule import Rule

class AlertAction(str, enum.Enum):
    """Enumeration for the final decision/action taken on a transaction."""
    APPROVE = "APPROVE"
    REVIEW = "REVIEW"
    DECLINE = "DECLINE"

@dataclass
class Alert:
    """
    Represents an alert generated for a suspicious transaction.
    """
    transaction_id: UUID
    transaction_occurred_at: datetime
    action: AlertAction
    ml_score: Optional[float] = None
    final_score: Optional[float] = None
    rule_hits: Optional[Dict[str, Any]] = None 
    created_at: datetime = field(default_factory=datetime.utcnow)
    created_by: Optional[UUID] = None 
    id: UUID = field(default_factory=uuid4)
    transaction: Optional[Transaction] = None
    creator: Optional[Analyst] = None
    triggered_rules: Optional[List[Rule]] = None 