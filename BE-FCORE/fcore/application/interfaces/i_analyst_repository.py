from abc import ABC, abstractmethod
from typing import List, Optional
from ...core.entities.analyst import Analyst

class IAnalystRepository(ABC):
    @abstractmethod
    def create(self, analyst: Analyst) -> Analyst:
        pass
    
    @abstractmethod
    def find_by_code(self, code: str) -> Optional[Analyst]:
        pass
    
    @abstractmethod
    def get_all(self) -> List[Analyst]:
        pass
    
    @abstractmethod
    def find_by_id(self, id: int) -> Optional[Analyst]:
        pass
    
    @abstractmethod
    def update(self, analyst: Analyst) -> Analyst:
        pass
    
    @abstractmethod
    def deactivate(self, code: str) -> Optional[Analyst]:
        pass
    
    