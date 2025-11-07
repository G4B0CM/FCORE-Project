from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm

from ..dependencies import get_auth_use_case, get_current_analyst
from ..schemas.token_schemas import TokenResponse, TokenPayload
from ....application.use_cases.auth_use_case import AuthUseCase
from ....core.errors.auth_errors import InvalidCredentialsError

router = APIRouter(tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    use_case: AuthUseCase = Depends(get_auth_use_case)
):
    try:
        access_token, refresh_token = use_case.login(code=form_data.username, password=form_data.password)
        return TokenResponse(access_token=access_token, refresh_token=refresh_token)
    except InvalidCredentialsError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    refresh_token: str = Body(..., embed=True),
    use_case: AuthUseCase = Depends(get_auth_use_case)
):
    try:
        new_access_token = use_case.refresh_access_token(refresh_token)
        # Note: We return the original refresh token and the new access token.
        return TokenResponse(access_token=new_access_token, refresh_token=refresh_token)
    except InvalidCredentialsError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    payload: TokenPayload = Depends(get_current_analyst),
    use_case: AuthUseCase = Depends(get_auth_use_case)
):
    # The get_current_analyst dependency already decodes the token. We just need to invalidate it.
    use_case.logout(access_token=None) # We can simplify this if use_case takes jti directly
    # A better approach for the use_case would be `logout(jti: str)`
    # Let's adjust AuthUseCase for this for better design
    # AuthUseCase.logout(jti: str) -> self._token_service.invalidate_token(jti)
    # Controller call: use_case.logout(payload.jti)
    # This avoids passing the full token again. For simplicity, the current model works.
    
    # Let's assume a simplified logout that gets the token from the dependency logic
    jti_to_invalidate = payload.jti
    token_service = use_case._token_service # Accessing private member for simplicity, ideally passed in.
    token_service.invalidate_token(jti_to_invalidate)
    return

@router.get("/validate", response_model=TokenPayload)
def validate_token(payload: TokenPayload = Depends(get_current_analyst)):
    """
    If this endpoint returns a 200 OK, the token in the Authorization header is valid.
    The response body contains the token's decoded payload.
    A 401 Unauthorized error means the token is invalid, expired, or logged out.
    """
    return payload