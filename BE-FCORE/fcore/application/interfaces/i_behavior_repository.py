from abc import ABC, abstractmethod
from typing import Dict, Optional
from uuid import UUID
from ...core.entities.behavior_profile import BehaviorProfile

class IBehaviorRepository(ABC):

    @abstractmethod
    def get_by_customer_id(self, customer_id: UUID) -> Optional[BehaviorProfile]:
        pass

    @abstractmethod
    def save(self, profile: BehaviorProfile) -> BehaviorProfile:
        pass

    @abstractmethod
    def calculate_features_from_history(self, customer_id: UUID) -> Dict[str, any]:
        pass