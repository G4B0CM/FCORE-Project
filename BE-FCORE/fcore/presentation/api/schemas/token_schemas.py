from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    code: str | None = None
    
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: str  # Subject (the analyst's code)
    role: str  # Role name
    exp: int  # Expiration time
    jti: str  # JWT ID (for logout)
    type: str