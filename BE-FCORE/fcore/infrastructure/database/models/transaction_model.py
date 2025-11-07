from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Numeric, Enum
from sqlalchemy.orm import relationship
from uuid import uuid4
import datetime

from ....core.entities.transaction import Transaction, TransactionChannel
from .base_db_model import Base, UUID_CHAR

class TransactionModel(Base):
    __tablename__ = 'transactions'
    
    id = Column(UUID_CHAR, primary_key=True, default=uuid4)
    customer_id = Column(UUID_CHAR, ForeignKey('customers.id'), nullable=False, index=True)
    merchant_id = Column(UUID_CHAR, ForeignKey('merchants.id'), nullable=False, index=True)
    
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), nullable=False, default='USD')
    channel = Column(Enum(TransactionChannel), nullable=False)
    occurred_at = Column(DateTime(timezone=True), nullable=False, default=datetime.datetime.utcnow)
    
    device_id = Column(String(255), nullable=True)
    ip_address = Column(String(45), nullable=True)
    country = Column(String(2), nullable=True)
    
    label_fraud = Column(Boolean, nullable=True)

    customer = relationship("CustomerModel")
    merchant = relationship("MerchantModel")

    def to_entity(self) -> Transaction:
        return Transaction(
            id=self.id,
            customer_id=self.customer_id,
            merchant_id=self.merchant_id,
            amount=self.amount,
            currency=self.currency,
            channel=self.channel,
            occurred_at=self.occurred_at,
            device_id=self.device_id,
            ip_address=self.ip_address,
            country=self.country,
            label_fraud=self.label_fraud,
            customer=self.customer.to_entity() if self.customer else None,
            merchant=self.merchant.to_entity() if self.merchant else None
        )

    @staticmethod
    def from_entity(tx: Transaction) -> "TransactionModel":
        return TransactionModel(
            id=tx.id,
            customer_id=tx.customer_id,
            merchant_id=tx.merchant_id,
            amount=tx.amount,
            currency=tx.currency,
            channel=tx.channel,
            occurred_at=tx.occurred_at,
            device_id=tx.device_id,
            ip_address=tx.ip_address,
            country=tx.country,
            label_fraud=tx.label_fraud
        )