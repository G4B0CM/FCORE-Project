import bcrypt
from ...application.interfaces.i_password_hasher import IPasswordHasher

class BcryptPasswordHasher(IPasswordHasher):
    """
    A concrete implementation of the password hasher interface using bcrypt.
    """
    def hash(self, password: str) -> str:
        """
        Hashes a plain-text password.
        """
        pwd_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_bytes = bcrypt.hashpw(pwd_bytes, salt)
        return hashed_bytes.decode('utf-8')

    def verify(self, password: str, hashed_password: str) -> bool:
        """
        Verifies a plain-text password against a stored hash.
        """
        password_bytes = password.encode('utf-8')
        hashed_password_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_password_bytes)