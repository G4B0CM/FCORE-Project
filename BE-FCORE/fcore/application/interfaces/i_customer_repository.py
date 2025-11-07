from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from ...core.entities.customer import Customer

class ICustomerRepository(ABC):
    """Interface for the Customer repository."""

    @abstractmethod
    def create(self, customer: Customer) -> Customer:
        pass

    @abstractmethod
    def find_by_id(self, id: UUID) -> Optional[Customer]:
        pass

    @abstractmethod
    def find_by_document_number(self, document_number: str) -> Optional[Customer]:
        pass

    @abstractmethod
    def get_all(self) -> List[Customer]:
        pass

    @abstractmethod
    def update(self, customer: Customer) -> Customer:
        pass

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        pass