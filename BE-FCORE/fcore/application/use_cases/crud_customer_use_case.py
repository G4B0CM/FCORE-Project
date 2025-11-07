from typing import List
from uuid import UUID
from ...core.entities.customer import Customer
from ..interfaces.i_customer_repository import ICustomerRepository
from ...core.errors.customer_errors import CustomerNotFoundError, CustomerAlreadyExistsError

class CrudCustomerUseCase:
    """Use case for CRUD operations on a Customer."""
    
    def __init__(self, customer_repository: ICustomerRepository):
        self._customer_repository = customer_repository

    def create(self, full_name: str, document_number: str, segment: str = None, age: int = None) -> Customer:
        if self._customer_repository.find_by_document_number(document_number):
            raise CustomerAlreadyExistsError(f"Customer with document number {document_number} already exists.")
        
        customer_entity = Customer(
            full_name=full_name,
            document_number=document_number,
            segment=segment,
            age=age
        )
        return self._customer_repository.create(customer_entity)

    def get_by_id(self, id: UUID) -> Customer:
        customer = self._customer_repository.find_by_id(id)
        if not customer:
            raise CustomerNotFoundError(f"Customer with ID {id} not found.")
        return customer

    def get_all(self) -> List[Customer]:
        return self._customer_repository.get_all()

    def update(self, id: UUID, update_data: dict) -> Customer:
        customer_to_update = self.get_by_id(id)

        # Check for document number collision if it's being changed
        if 'document_number' in update_data and update_data['document_number'] != customer_to_update.document_number:
            existing = self._customer_repository.find_by_document_number(update_data['document_number'])
            if existing:
                raise CustomerAlreadyExistsError(f"Customer with document number {update_data['document_number']} already exists.")

        # Update attributes
        for key, value in update_data.items():
            if hasattr(customer_to_update, key):
                setattr(customer_to_update, key, value)
        
        customer_to_update.__post_init__() # Re-validate
        return self._customer_repository.update(customer_to_update)

    def delete(self, id: UUID) -> bool:
        if not self._customer_repository.find_by_id(id):
            raise CustomerNotFoundError(f"Customer with ID {id} not found.")
        return self._customer_repository.delete(id)