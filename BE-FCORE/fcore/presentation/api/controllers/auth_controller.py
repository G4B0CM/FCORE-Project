# auth_controller.py
from fastapi import APIRouter, Depends, HTTPException, status, Body
from ..dependencies import get_auth_use_case, get_current_analyst
from ..schemas.token_schemas import TokenResponse, TokenPayload
from ....application.use_cases.auth_use_case import AuthUseCase
from ....core.errors.auth_errors import InvalidCredentialsError
from ..schemas.analyst_schemas import AnalystLogin

router = APIRouter(prefix='/auth', tags=['Authentication'])

@router.post('/login', response_model=TokenResponse)
def login(
    payload: AnalystLogin = Body(...),
    use_case: AuthUseCase = Depends(get_auth_use_case),
):
    try:
        access_token, refresh_token = use_case.login(code=payload.username, password=payload.password)
        return TokenResponse(access_token=access_token, refresh_token=refresh_token)
    except InvalidCredentialsError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={'WWW-Authenticate': 'Bearer'},
        )

@router.post('/refresh', response_model=TokenResponse)
def refresh_token(
    refresh_token: str = Body(..., embed=True),
    use_case: AuthUseCase = Depends(get_auth_use_case),
):
    try:
        new_access_token = use_case.refresh_access_token(refresh_token)
        return TokenResponse(access_token=new_access_token, refresh_token=refresh_token)
    except InvalidCredentialsError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

@router.post('/logout', status_code=status.HTTP_204_NO_CONTENT)
def logout(
    payload: TokenPayload = Depends(get_current_analyst),
    use_case: AuthUseCase = Depends(get_auth_use_case),
):
    jti_to_invalidate = payload.jti
    token_service = use_case._token_service
    token_service.invalidate_token(jti_to_invalidate)
    return

@router.get('/validate', response_model=TokenPayload)
def validate_token(payload: TokenPayload = Depends(get_current_analyst)):
    return payload
