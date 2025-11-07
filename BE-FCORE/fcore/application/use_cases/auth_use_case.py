# File: fcore/application/use_cases/auth_use_case.py
from ..interfaces.i_analyst_repository import IAnalystRepository
from ..interfaces.i_password_hasher import IPasswordHasher
from ..interfaces.i_token_provider import ITokenProvider
from ...core.errors.auth_errors import InvalidCredentialsError

class AuthUseCase:
    def __init__(
        self,
        analyst_repo: IAnalystRepository,
        password_hasher: IPasswordHasher,
        token_service: ITokenProvider
    ):
        self._analyst_repo = analyst_repo
        self._password_hasher = password_hasher
        self._token_service = token_service

    def login(self, code: str, password: str) -> tuple[str, str]:
        analyst = self._analyst_repo.find_by_code(code)
        if not analyst or not self._password_hasher.verify(password, analyst.password_hash):
            raise InvalidCredentialsError("Analyst code or password incorrect.")
        
        if not analyst.is_active:
            raise InvalidCredentialsError("Analyst account is inactive.")
            
        access_token, refresh_token = self._token_service.create_tokens(
            user_code=analyst.code,
            role=analyst.role.name
        )
        return access_token, refresh_token

    def refresh_access_token(self, refresh_token: str) -> str:
        try:
            payload = self._token_service.decode_refresh_token(refresh_token)
            
            analyst = self._analyst_repo.find_by_code(payload.sub)
            if not analyst or not analyst.is_active:
                raise InvalidCredentialsError("Invalid user for token refresh.")

            new_access_token, _ = self._token_service.create_tokens(
                user_code=analyst.code,
                role=analyst.role.name 
            )
            return new_access_token
        except ValueError:
            raise InvalidCredentialsError("Invalid or expired refresh token.")

    def logout(self, access_token: str):
        try:
            payload = self._token_service.decode_access_token(access_token)
            self._token_service.invalidate_token(payload.jti)
        except ValueError:
            pass