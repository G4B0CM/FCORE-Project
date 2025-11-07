from dataclasses import dataclass, field
import re
from typing import Optional
from uuid import UUID, uuid4
from ..errors.customer_errors import CustomerValidationError

@dataclass
class Customer:
    """
    Represents a cardholder in the domain.
    """
    full_name: str
    document_number: str # National ID, etc.
    segment: Optional[str] = None # e.g., 'premium', 'standard'
    age: Optional[int] = None
    risk_profile: str = 'medium' # Default risk profile
    id: UUID = field(default_factory=uuid4)

    def __post_init__(self):
        """Validates entity state after initialization."""
        if not self.full_name or len(self.full_name.strip()) < 3:
            raise CustomerValidationError("Customer full name must be at least 3 characters long.")
        if not self.document_number or len(self.document_number.strip()) < 5:
            raise CustomerValidationError("Customer document number must be at least 5 characters long.")
        if not re.search(r'^\d+$', self.document_number):
            raise CustomerValidationError("Customer document number must be a number")
        if self.age is not None and (self.age < 18 or self.age > 100):
            raise CustomerValidationError("Customer age must be between 18 and 100.")