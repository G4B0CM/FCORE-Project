"""
This is the main class for the user of the application
"""
import re
from dataclasses  import dataclass, field
from uuid import UUID, uuid4
from .role import Role
from .audit_mixin import AuditMixin
from ..errors.analyst_errors import AnalystValidationError

@dataclass
class Analyst(AuditMixin):
    name: str
    lastname: str
    password_hash: str
    code: str
    role: Role
    is_active: bool = True
    id: UUID = field(default_factory=uuid4)
    
    def __post_init__(self):
        """Validates entity state after initialization."""
        if not self.name or len(self.name.strip()) == 0:
            raise AnalystValidationError("Analyst name cannot be empty.")
        if not self.lastname or len(self.lastname.strip()) == 0:
            raise AnalystValidationError("Analyst lastname cannot be empty.")
        if not self.password_hash:
            raise AnalystValidationError("Password hash cannot be empty.")
        if not self.code or not re.search(r"^C\d{7,8}$", self.code):
            raise AnalystValidationError("Code must start with 'C' and have 8-9 total characters (e.g., C1234567).")

    def change_password(self, new_password_hash: str):
        if not new_password_hash:
            raise AnalystValidationError("New password hash cannot be empty.")
        self.password_hash = new_password_hash

    def deactivate(self):
        self.is_active = False