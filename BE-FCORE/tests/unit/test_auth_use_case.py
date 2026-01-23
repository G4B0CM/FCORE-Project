import pytest
from unittest.mock import Mock, MagicMock
from fcore.application.use_cases.auth_use_case import AuthUseCase
from fcore.core.errors.auth_errors import InvalidCredentialsError

@pytest.fixture
def mock_analyst_repo():
    return Mock()

@pytest.fixture
def mock_hasher():
    return Mock()

@pytest.fixture
def mock_token_service():
    return Mock()

@pytest.fixture
def auth_use_case(mock_analyst_repo, mock_hasher, mock_token_service):
    return AuthUseCase(mock_analyst_repo, mock_hasher, mock_token_service)

def test_login_success(auth_use_case, mock_analyst_repo, mock_hasher, mock_token_service):
    """HU-15: Verificar inicio de sesión exitoso."""
    # Arrange
    code = "A001"
    password = "secure_password"
    
    mock_analyst = MagicMock()
    mock_analyst.code = code
    mock_analyst.password_hash = "hashed_pw"
    mock_analyst.is_active = True
    mock_analyst.role.name = "ANALYST"
    
    mock_analyst_repo.find_by_code.return_value = mock_analyst
    mock_hasher.verify.return_value = True
    mock_token_service.create_tokens.return_value = ("access_token", "refresh_token")

    # Act
    access, refresh = auth_use_case.login(code, password)

    # Assert
    assert access == "access_token"
    assert refresh == "refresh_token"
    mock_analyst_repo.find_by_code.assert_called_with(code)

def test_login_invalid_credentials(auth_use_case, mock_analyst_repo, mock_hasher):
    """HU-15: Verificar error con contraseña incorrecta."""
    mock_analyst_repo.find_by_code.return_value = MagicMock() # Usuario existe
    mock_hasher.verify.return_value = False # Password incorrecto

    with pytest.raises(InvalidCredentialsError):
        auth_use_case.login("A001", "wrong_pass")

def test_login_inactive_user(auth_use_case, mock_analyst_repo, mock_hasher):
    """HU-15: Verificar bloqueo de usuarios inactivos."""
    mock_analyst = MagicMock()
    mock_analyst.is_active = False
    
    mock_analyst_repo.find_by_code.return_value = mock_analyst
    mock_hasher.verify.return_value = True

    with pytest.raises(InvalidCredentialsError) as exc:
        auth_use_case.login("A001", "pass")
    assert "inactiva" in str(exc.value)