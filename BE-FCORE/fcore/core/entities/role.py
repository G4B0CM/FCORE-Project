"""
This is the class that allows the oficers to have a rol
"""
from dataclasses  import dataclass
from typing import Optional
from ..errors.roles_errors import RolesValidationError

from dataclasses import dataclass, field
from typing import Optional
from uuid import UUID, uuid4
from ..errors.roles_errors import RolesValidationError

@dataclass
class Role:
    name: str
    description: Optional[str] = None
    is_active: bool = True
    id: UUID = field(default_factory=uuid4)
    
    def __post_init__(self):
        """Validates entity state after initialization."""
        if not self.name or len(self.name.strip()) < 3:
            raise RolesValidationError("Role name must be at least 3 characters long.")
    
    def deactivate(self) -> None:
        """Marks the role as inactive."""
        self.is_active = False
        
    def activate(self) -> None:
        """Marks the role as active."""
        self.is_active = True
        
        
        