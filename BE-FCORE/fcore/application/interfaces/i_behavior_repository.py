from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID
from ...core.entities.behavior_profile import BehaviorProfile

class IBehaviorRepository(ABC):
    """Interface for the BehaviorProfile repository."""

    @abstractmethod
    def get_by_customer_id(self, customer_id: UUID) -> Optional[BehaviorProfile]:
        pass

    @abstractmethod
    def save(self, profile: BehaviorProfile) -> BehaviorProfile:
        """Saves a profile (creates if not exists, updates if exists)."""
        pass