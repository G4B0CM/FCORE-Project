from dataclasses import dataclass, field
from typing import Optional
from uuid import UUID, uuid4
from ..errors.merchant_errors import MerchantValidationError

@dataclass
class Merchant:
    """
    Represents a merchant where transactions occur.
    """
    name: str
    category: str
    risk_level: str = 'medium'
    is_whitelisted: bool = False
    is_blacklisted: bool = False
    id: UUID = field(default_factory=uuid4)

    def __post_init__(self):
        """Validates entity state after initialization."""
        if not self.name or len(self.name.strip()) < 2:
            raise MerchantValidationError("Merchant name must be at least 2 characters long.")
        if not self.category or len(self.category.strip()) < 3:
            raise MerchantValidationError("Merchant category must be at least 3 characters long.")
        if self.is_whitelisted and self.is_blacklisted:
            raise MerchantValidationError("A merchant cannot be on the whitelist and blacklist simultaneously.")