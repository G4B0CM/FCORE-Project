from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
import datetime
from decimal import Decimal

from ....core.entities.behavior_profile import BehaviorProfile
from .base_db_model import Base, UUID_CHAR

class BehaviorProfileModel(Base):
    __tablename__ = 'behavior_profiles'
    
    customer_id = Column(UUID_CHAR, ForeignKey('customers.id'), primary_key=True)
    
    avg_amount_24h = Column(Numeric(10, 2), nullable=False, default=Decimal(0.0))
    tx_count_10m = Column(Integer, nullable=False, default=0)
    tx_count_30m = Column(Integer, nullable=False, default=0)
    tx_count_24h = Column(Integer, nullable=False, default=0)
    
    usual_country = Column(String(2), nullable=True)
    usual_ip = Column(String(45), nullable=True)
    usual_hour_band = Column(String(50), nullable=True)
    
    updated_at = Column(DateTime(timezone=True), nullable=False, default=datetime.datetime.utcnow)

    # one-to-one relationship
    customer = relationship("CustomerModel", backref="behavior_profile", uselist=False)

    def to_entity(self) -> BehaviorProfile:
        # Enriquecemos la entidad con el objeto customer si está cargado
        customer_entity = self.customer.to_entity() if self.customer else None
        
        return BehaviorProfile(
            customer_id=self.customer_id,
            avg_amount_24h=self.avg_amount_24h,
            tx_count_10m=self.tx_count_10m,
            tx_count_30m=self.tx_count_30m,
            tx_count_24h=self.tx_count_24h,
            usual_country=self.usual_country,
            usual_ip=self.usual_ip,
            usual_hour_band=self.usual_hour_band,
            updated_at=self.updated_at,
            customer=customer_entity
        )

    @staticmethod
    def from_entity(profile: BehaviorProfile) -> "BehaviorProfileModel":
        return BehaviorProfileModel(
            customer_id=profile.customer_id,
            avg_amount_24h=profile.avg_amount_24h,
            tx_count_10m=profile.tx_count_10m,
            tx_count_30m=profile.tx_count_30m,
            tx_count_24h=profile.tx_count_24h,
            usual_country=profile.usual_country,
            usual_ip=profile.usual_ip,
            usual_hour_band=profile.usual_hour_band,
            updated_at=profile.updated_at
        )