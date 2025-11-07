"""
This class is the main mixing for auditory purposes
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

@dataclass
class AuditMixin:
    created_at: datetime
    created_by: str
    updated_at: Optional[datetime] = field(default=None, init=False)
    updated_by: Optional[str] = field(default=None, init=False) 
