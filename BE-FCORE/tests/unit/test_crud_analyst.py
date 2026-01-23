# File: tests/unit/test_crud_analyst.py
import pytest
from unittest.mock import Mock, MagicMock
from fcore.application.use_cases.crud_analyst_use_case import CrudAnalystUseCase
from fcore.core.errors.analyst_errors import AnalystAlreadyExistsError

def test_create_analyst_success():
    """HU-08: Crear analista exitosamente."""
    # Arrange
    repo = Mock()
    role_repo = Mock()
    hasher = Mock()
    use_case = CrudAnalystUseCase(repo, role_repo, hasher)

    schema = MagicMock()
    schema.code = "C1000002"
    schema.password = "123456"
    schema.role_id = 1
    # --- FIX: Definimos datos obligatorios para pasar la validación de la Entidad ---
    schema.name = "Test Name"
    schema.lastname = "Test Lastname"
    # ------------------------------------------------------------------------------

    repo.find_by_code.return_value = None # No existe
    role_entity = MagicMock()
    role_entity.is_active = True
    role_repo.find_by_id.return_value = role_entity
    hasher.hash.return_value = "hashed_secret"

    # Act
    use_case.create(schema, "ADMIN_USER")

    # Assert
    repo.create.assert_called_once()
    hasher.hash.assert_called_with("123456")

def test_create_analyst_duplicate_code():
    """HU-08: Error al crear analista duplicado."""
    repo = Mock()
    use_case = CrudAnalystUseCase(repo, Mock(), Mock())
    
    repo.find_by_code.return_value = MagicMock() # Ya existe

    schema = MagicMock()
    schema.code = "C1000002"

    with pytest.raises(AnalystAlreadyExistsError):
        use_case.create(schema, "ADMIN")