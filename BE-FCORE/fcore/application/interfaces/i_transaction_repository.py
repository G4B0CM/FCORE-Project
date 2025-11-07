from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from ...core.entities.transaction import Transaction

class ITransactionRepository(ABC):
    """Interface for the Transaction repository."""

    @abstractmethod
    def create(self, transaction: Transaction) -> Transaction:
        pass

    @abstractmethod
    def find_by_id(self, id: UUID) -> Optional[Transaction]:
        pass

    @abstractmethod
    def find_by_customer_id(self, customer_id: UUID) -> List[Transaction]:
        pass

    @abstractmethod
    def get_all(self, limit: int = 100, offset: int = 0) -> List[Transaction]:
        pass