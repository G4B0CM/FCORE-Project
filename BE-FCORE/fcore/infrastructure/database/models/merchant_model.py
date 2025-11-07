from sqlalchemy import Column, String, Boolean
from uuid import uuid4
from ....core.entities.merchant import Merchant
from .base_db_model import Base, UUID_CHAR

class MerchantModel(Base):
    __tablename__ = 'merchants'
    
    id = Column(UUID_CHAR, primary_key=True, default=uuid4)
    name = Column(String(150), nullable=False, unique=True, index=True)
    category = Column(String(100), nullable=False)
    risk_level = Column(String(50), nullable=False, default='medium')
    is_whitelisted = Column(Boolean, nullable=False, default=False)
    is_blacklisted = Column(Boolean, nullable=False, default=False)

    def to_entity(self) -> Merchant:
        return Merchant(
            id=self.id,
            name=self.name,
            category=self.category,
            risk_level=self.risk_level,
            is_whitelisted=self.is_whitelisted,
            is_blacklisted=self.is_blacklisted
        )

    @staticmethod
    def from_entity(merchant: Merchant) -> "MerchantModel":
        return MerchantModel(
            id=merchant.id,
            name=merchant.name,
            category=merchant.category,
            risk_level=merchant.risk_level,
            is_whitelisted=merchant.is_whitelisted,
            is_blacklisted=merchant.is_blacklisted
        )