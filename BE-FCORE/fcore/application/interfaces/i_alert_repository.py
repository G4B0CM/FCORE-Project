from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from ...core.entities.alert import Alert

class IAlertRepository(ABC):
    """Interface for the Alert repository."""

    @abstractmethod
    def create(self, alert: Alert) -> Alert:
        pass

    @abstractmethod
    def find_by_id(self, id: UUID) -> Optional[Alert]:
        pass

    @abstractmethod
    def get_all(self, limit: int = 100, offset: int = 0) -> List[Alert]:
        pass
    
    # We won't have a generic update, but specific actions can be added later
    # e.g., assign_to_analyst, change_status, etc.