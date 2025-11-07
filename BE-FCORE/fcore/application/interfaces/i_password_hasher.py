"""
Interface that allows to hash and verify a password
"""

from abc import ABC, abstractmethod

class IPasswordHasher(ABC):
    @abstractmethod
    def hash(self, unhashed_password : str) -> str:
        pass
    
    @abstractmethod
    def verify(self, plain_password: str, hash: str) -> bool:
        pass
