from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from ...core.entities.role import Role

class IRoleRepository(ABC):
    """Interface for the Role repository."""

    @abstractmethod
    def create(self, role: Role) -> Role:
        """Creates a new role."""
        pass

    @abstractmethod
    def find_by_id(self, id: UUID) -> Optional[Role]:
        """Finds a role by its UUID."""
        pass
    
    @abstractmethod
    def find_by_name(self, name: str) -> Optional[Role]:
        """Finds a role by its name."""
        pass

    @abstractmethod
    def get_all(self) -> List[Role]:
        """Returns a list of all roles."""
        pass

    @abstractmethod
    def update(self, role: Role) -> Role:
        """Updates an existing role."""
        pass

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        """Deletes a role by its UUID."""
        pass