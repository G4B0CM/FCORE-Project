from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ....core.entities.customer import Customer
from ....application.interfaces.i_customer_repository import ICustomerRepository
from ..models.customer_model import CustomerModel
from ....core.errors.customer_errors import CustomerAlreadyExistsError

class SqlAlchemyCustomerRepository(ICustomerRepository):
    def __init__(self, session: Session):
        self._session = session

    def create(self, customer: Customer) -> Customer:
        customer_model = CustomerModel.from_entity(customer)
        try:
            self._session.add(customer_model)
            self._session.flush()
            self._session.commit()
            return customer_model.to_entity()
        except IntegrityError:
            self._session.rollback()
            raise CustomerAlreadyExistsError(f"Customer with document number '{customer.document_number}' already exists.")

    def find_by_id(self, id: UUID) -> Optional[Customer]:
        model = self._session.query(CustomerModel).filter_by(id=id).first()
        return model.to_entity() if model else None

    def find_by_document_number(self, document_number: str) -> Optional[Customer]:
        model = self._session.query(CustomerModel).filter_by(document_number=document_number).first()
        return model.to_entity() if model else None

    def get_all(self) -> List[Customer]:
        models = self._session.query(CustomerModel).all()
        return [model.to_entity() for model in models]

    def update(self, customer: Customer) -> Customer:
        model = self._session.query(CustomerModel).filter_by(id=customer.id).first()
        if model:
            model.full_name = customer.full_name
            model.document_number = customer.document_number
            model.segment = customer.segment
            model.age = customer.age
            model.risk_profile = customer.risk_profile
            self._session.flush()
            self._session.commit()
            return model.to_entity()
        return None

    def delete(self, id: UUID) -> bool:
        model = self._session.query(CustomerModel).filter_by(id=id).first()
        if model:
            self._session.delete(model)
            self._session.flush()
            self._session.commit()
            return True
        return False