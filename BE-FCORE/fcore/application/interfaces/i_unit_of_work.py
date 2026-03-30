from abc import ABC, abstractmethod
from types import TracebackType
from typing import Optional, Type

from .i_analyst_repository import IAnalystRepository
from .i_role_repository import IRoleRepository

class IUnitOfWork(ABC):
    
    analyst_repository: IAnalystRepository
    role_repository: IRoleRepository

    @abstractmethod
    def __enter__(self) -> "IUnitOfWork":
        pass

    @abstractmethod
    def __exit__(
        self, 
        exc_type: Optional[Type[BaseException]], 
        exc_val: Optional[BaseException], 
        exc_tb: Optional[TracebackType]
    ) -> None:
        pass

    @abstractmethod
    def commit(self) -> None:
        pass

    @abstractmethod
    def rollback(self) -> None:
        pass