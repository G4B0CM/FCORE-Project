from abc import ABC, abstractmethod
from types import TracebackType
from typing import Optional, Type

from .i_analyst_repository import IAnalystRepository
from .i_role_repository import IRoleRepository

class IUnitOfWork(ABC):
    """
    Interface for the Unit of Work pattern.
    It manages the database transaction and provides access to repositories.
    """
    
    analyst_repository: IAnalystRepository
    role_repository: IRoleRepository

    @abstractmethod
    def __enter__(self) -> "IUnitOfWork":
        """Starts the transaction."""
        pass

    @abstractmethod
    def __exit__(
        self, 
        exc_type: Optional[Type[BaseException]], 
        exc_val: Optional[BaseException], 
        exc_tb: Optional[TracebackType]
    ) -> None:
        """Ends the transaction, rolling back if an exception occurred."""
        pass

    @abstractmethod
    def commit(self) -> None:
        """Commits the transaction."""
        pass

    @abstractmethod
    def rollback(self) -> None:
        """Rolls back the transaction."""
        pass