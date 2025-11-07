"""
Interface Repository of the main user of the system
"""

from abc import ABC, abstractmethod
from typing import List, Optional
from ...core.entities.analyst import Analyst

class IAnalystRepository(ABC):
    @abstractmethod
    def create(self, analyst: Analyst) -> Analyst:
        """
        Guarda un nuevo Analyst en la base de datos y devuelve la entidad con su ID asignado.
        """
        pass
    
    @abstractmethod
    def find_by_code(self, code: str) -> Optional[Analyst]:
        """
        Busca un Analyst por su Code. Devuelve el Analyst o None si no se encuentra.
        """
        pass
    
    @abstractmethod
    def get_all(self) -> List[Analyst]:
        """
        Devuelve todos los Analystes.
        """
        pass
    
    @abstractmethod
    def find_by_id(self, id: int) -> Optional[Analyst]:
        """
        Busca un Analyst por su ID. Devuelve el Analyst o None si no se encuentra.
        """
        pass
    
    @abstractmethod
    def update(self, analyst: Analyst) -> Analyst:
        """
        Actualiza los datos de un Analyst existente y devuelve la entidad actualizada.
        """
        pass
    
    @abstractmethod
    def deactivate(self, code: str) -> Optional[Analyst]:
        """
        Desactiva un Analyst (soft delete). Devuelve True si tuvo éxito.
        """
        pass
    
    