from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from .customer_schemas import CustomerResponse

class BehaviorProfileResponse(BaseModel):
    customer_id: UUID
    avg_amount_24h: Decimal
    tx_count_10m: int
    tx_count_30m: int
    tx_count_24h: int
    usual_country: Optional[str]
    usual_ip: Optional[str]
    usual_hour_band: Optional[str]
    updated_at: datetime
    customer: Optional[CustomerResponse]

    class Config:
        from_attributes = True