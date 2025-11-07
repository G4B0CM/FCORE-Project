from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from .customer import Customer

@dataclass
class BehaviorProfile:
    """
    Represents the aggregated transactional behavior of a customer.
    """
    customer_id: UUID
    avg_amount_24h: Decimal = Decimal(0.0)
    tx_count_10m: int = 0
    tx_count_30m: int = 0
    tx_count_24h: int = 0
    usual_country: Optional[str] = None
    usual_ip: Optional[str] = None
    usual_hour_band: Optional[str] = None # e.g., 'morning', 'afternoon'
    updated_at: datetime = field(default_factory=datetime.utcnow)
    customer: Optional[Customer] = None