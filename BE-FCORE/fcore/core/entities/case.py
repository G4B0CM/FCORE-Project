import enum
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from .alert import Alert
from .analyst import Analyst
from ..errors.case_errors import CaseValidationError

class CaseDecision(str, enum.Enum):
    """Enumeration for the final decision made on a case."""
    PENDING = "PENDING"
    CONFIRMED_FRAUD = "CONFIRMED_FRAUD"
    FALSE_POSITIVE = "FALSE_POSITIVE"

@dataclass
class Case:
    """
    Represents an investigation case opened by an analyst for an alert.
    """
    alert_id: UUID
    analyst_id: UUID 
    decision: CaseDecision = CaseDecision.PENDING
    notes: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    id: UUID = field(default_factory=uuid4)

    # --- Enriched Fields ---
    alert: Optional[Alert] = None
    analyst: Optional[Analyst] = None

    def add_note(self, new_note: str, analyst_name: str):
        """Appends a new note to the case notes."""
        timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        formatted_note = f"[{timestamp} - {analyst_name}]: {new_note}\n"
        if self.notes:
            self.notes += formatted_note
        else:
            self.notes = formatted_note
        self.updated_at = datetime.utcnow()

    def resolve(self, decision: CaseDecision):
        """Resolves the case with a final decision."""
        if self.decision != CaseDecision.PENDING:
            raise CaseValidationError(f"Case is already resolved with decision: {self.decision.value}.")
        if decision not in [CaseDecision.CONFIRMED_FRAUD, CaseDecision.FALSE_POSITIVE]:
            raise CaseValidationError("Resolution decision must be either CONFIRMED_FRAUD or FALSE_POSITIVE.")
        self.decision = decision
        self.updated_at = datetime.utcnow()