import enum
from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID, uuid4

from .customer import Customer
from .merchant import Merchant
from ..errors.transaction_errors import TransactionValidationError

class TransactionChannel(str, enum.Enum):
    """Enumeration for the transaction channel."""
    POS = "POS"
    ECOM = "ECOM"

@dataclass
class Transaction:
    """
    Represents a financial transaction event. This entity is immutable by design.
    """
    customer_id: UUID
    merchant_id: UUID
    amount: Decimal
    currency: str = "USD"
    channel: TransactionChannel = TransactionChannel.ECOM
    occurred_at: datetime = field(default_factory=datetime.utcnow)
    device_id: Optional[str] = None
    ip_address: Optional[str] = None
    country: Optional[str] = None
    label_fraud: Optional[bool] = None
    customer: Optional[Customer] = None
    merchant: Optional[Merchant] = None
    id: UUID = field(default_factory=uuid4)

    def __post_init__(self):
        """Validates entity state after initialization."""
        if self.amount <= Decimal(0):
            raise TransactionValidationError("Transaction amount must be positive.")
        if len(self.currency) != 3:
            raise TransactionValidationError("Currency must be a 3-letter code (e.g., USD).")