class InvalidCredentialsError(Exception):
    """Lanzado cuando las credenciales son invalidas"""
    pass

class UserValidationError(ValueError):
    """Lazando cuando el usuario no cumple los requisitos"""
    pass

class TokenValidationError(Exception):
    """Lanzado cuando el token ingresado es invalido"""
    pass

class ExpiredTokenError(Exception):
    """Lanzado cuando la firma no corresponde al token"""
    pass