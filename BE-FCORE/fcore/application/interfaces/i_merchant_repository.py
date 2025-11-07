from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from ...core.entities.merchant import Merchant

class IMerchantRepository(ABC):
    """Interface for the Merchant repository."""

    @abstractmethod
    def create(self, merchant: Merchant) -> Merchant:
        pass

    @abstractmethod
    def find_by_id(self, id: UUID) -> Optional[Merchant]:
        pass

    @abstractmethod
    def find_by_name(self, name: str) -> Optional[Merchant]:
        pass

    @abstractmethod
    def get_all(self) -> List[Merchant]:
        pass

    @abstractmethod
    def update(self, merchant: Merchant) -> Merchant:
        pass

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        pass