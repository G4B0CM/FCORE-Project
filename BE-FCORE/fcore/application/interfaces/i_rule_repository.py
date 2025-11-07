from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from ...core.entities.rule import Rule

class IRuleRepository(ABC):
    """Interface for the Rule repository."""

    @abstractmethod
    def create(self, rule: Rule) -> Rule:
        pass

    @abstractmethod
    def find_by_id(self, id: UUID) -> Optional[Rule]:
        pass

    @abstractmethod
    def find_by_name(self, name: str) -> Optional[Rule]:
        pass

    @abstractmethod
    def get_all(self, only_enabled: bool = False) -> List[Rule]:
        pass

    @abstractmethod
    def update(self, rule: Rule) -> Rule:
        pass

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        pass