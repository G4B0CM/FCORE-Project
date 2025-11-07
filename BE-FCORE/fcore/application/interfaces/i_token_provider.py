from abc import ABC, abstractmethod
from typing import Tuple
from ...presentation.api.schemas.token_schemas import TokenPayload

class ITokenProvider(ABC):
    @abstractmethod
    def create_tokens(self, user_code: str, role: str) -> Tuple[str, str]:
        """Creates both an access and a refresh token."""
        pass

    @abstractmethod
    def decode_access_token(self, token: str) -> TokenPayload:
        """Decodes an access token and returns its payload."""
        pass
    
    @abstractmethod
    def decode_refresh_token(self, token: str) -> TokenPayload:
        """Decodes a refresh token and returns its payload."""
        pass

    @abstractmethod
    def invalidate_token(self, token_jti: str) -> None:
        """Adds a token's JTI to the denylist to invalidate it."""
        pass

    @abstractmethod
    def is_token_invalidated(self, token_jti: str) -> bool:
        """Checks if a token's JTI is in the denylist."""
        pass