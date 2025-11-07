from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from ....core.entities.transaction import TransactionChannel
from .customer_schemas import CustomerResponse
from .merchant_schemas import MerchantResponse

class TransactionBase(BaseModel):
    amount: Decimal = Field(..., gt=0, description="Transaction amount")
    channel: TransactionChannel
    device_id: Optional[str] = Field(None, max_length=255)
    ip_address: Optional[str] = Field(None, max_length=45)
    country: Optional[str] = Field(None, min_length=2, max_length=2)

class TransactionCreate(TransactionBase):
    customer_id: UUID
    merchant_id: UUID

class TransactionResponse(TransactionBase):
    id: UUID
    customer_id: UUID
    merchant_id: UUID
    currency: str
    occurred_at: datetime
    customer: Optional[CustomerResponse]
    merchant: Optional[MerchantResponse]

    class Config:
        from_attributes = True