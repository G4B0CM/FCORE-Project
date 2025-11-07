from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from ...core.entities.case import Case

class ICaseRepository(ABC):
    """Interface for the Case repository."""

    @abstractmethod
    def create(self, case: Case) -> Case:
        pass

    @abstractmethod
    def find_by_id(self, id: UUID) -> Optional[Case]:
        pass

    @abstractmethod
    def find_by_alert_id(self, alert_id: UUID) -> Optional[Case]:
        pass

    @abstractmethod
    def get_all(self, limit: int = 100, offset: int = 0) -> List[Case]:
        pass

    @abstractmethod
    def update(self, case: Case) -> Case:
        pass