import enum
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from .audit_mixin import AuditMixin
from ..errors.rule_errors import RuleValidationError

class RuleSeverity(str, enum.Enum):
    """Enumeration for rule severity levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class Rule(AuditMixin):
    """
    Represents a declarative fraud detection rule.
    """
    name: str
    dsl_expression: str
    severity: RuleSeverity = RuleSeverity.MEDIUM
    enabled: bool = True

    id: UUID = field(default_factory=uuid4)

    def __post_init__(self):
        """Validates entity state after initialization."""
        if not self.name or len(self.name.strip()) < 5:
            raise RuleValidationError("Rule name must be at least 5 characters long.")
        if not self.dsl_expression or len(self.dsl_expression.strip()) < 10:
            raise RuleValidationError("Rule DSL expression must be at least 10 characters long.")