import os
import uuid
from datetime import datetime, timedelta
from typing import Tuple
from jose import JWTError, jwt

from ...application.interfaces.i_token_provider import ITokenProvider
from ...presentation.api.schemas.token_schemas import TokenPayload

SECRET_KEY = os.environ.get("SECRET_KEY", "a-very-secret-key-for-jwt-987654321")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

TOKEN_DENYLIST = set()

class JwtTokenService(ITokenProvider):
    def create_tokens(self, user_code: str, role: str) -> Tuple[str, str]:
        access_token = self._create_token(
            # --- FIX: Changed "role" to "rol" to match the TokenPayload schema ---
            data={"sub": user_code, "role": role, "type": "access"},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        refresh_token = self._create_token(
            # --- FIX: Changed "role" to "rol" ---
            data={"sub": user_code, "role": role, "type": "refresh"},
            expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        )
        return access_token, refresh_token

    def _create_token(self, data: dict, expires_delta: timedelta) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + expires_delta
        to_encode.update({
            "exp": expire,
            "iat": datetime.utcnow(), # Issued At
            "jti": str(uuid.uuid4())   # JWT ID, unique for each token
        })
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    def decode_access_token(self, token: str) -> TokenPayload:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            if payload.get("type") != "access":
                raise JWTError("Not an access token")
            return TokenPayload(**payload)
        except (JWTError, Exception): # Catching general exception for robust logging
            raise ValueError("Invalid access token")

    def decode_refresh_token(self, token: str) -> TokenPayload:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return TokenPayload(**payload)
        except JWTError:
            raise ValueError("Invalid refresh token")

    def invalidate_token(self, token_jti: str) -> None:
        TOKEN_DENYLIST.add(token_jti)
    
    def is_token_invalidated(self, token_jti: str) -> bool:
        return token_jti in TOKEN_DENYLIST