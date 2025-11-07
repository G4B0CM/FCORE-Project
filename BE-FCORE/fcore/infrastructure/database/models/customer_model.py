from sqlalchemy import Column, String, Integer
from uuid import uuid4
from ....core.entities.customer import Customer
from .base_db_model import Base, UUID_CHAR

class CustomerModel(Base):
    __tablename__ = 'customers'
    
    id = Column(UUID_CHAR, primary_key=True, default=uuid4)
    full_name = Column(String(200), nullable=False)
    document_number = Column(String(50), nullable=False, unique=True, index=True)
    segment = Column(String(50), nullable=True)
    age = Column(Integer, nullable=True)
    risk_profile = Column(String(50), nullable=False, default='medium')

    def to_entity(self) -> Customer:
        return Customer(
            id=self.id,
            full_name=self.full_name,
            document_number=self.document_number,
            segment=self.segment,
            age=self.age,
            risk_profile=self.risk_profile
        )

    @staticmethod
    def from_entity(customer: Customer) -> "CustomerModel":
        return CustomerModel(
            id=customer.id,
            full_name=customer.full_name,
            document_number=customer.document_number,
            segment=customer.segment,
            age=customer.age,
            risk_profile=customer.risk_profile
        )