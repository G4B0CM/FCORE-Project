import pytest
from unittest.mock import Mock, MagicMock
from fcore.application.use_cases.crud_analyst_use_case import CrudAnalystUseCase
from fcore.core.errors.analyst_errors import AnalystAlreadyExistsError

@pytest.fixture
def mock_uow():
    uow = MagicMock()
    uow.__enter__.return_value = uow
    uow.__exit__.return_value = None
    
    uow.analyst_repository = Mock()
    uow.role_repository = Mock()
    return uow

def test_create_analyst_success(mock_uow):
    hasher = Mock()
    
    use_case = CrudAnalystUseCase(mock_uow, hasher)

    schema = MagicMock()
    schema.code = "C1000002"
    schema.password = "123456"
    schema.role_id = 1
    schema.name = "Test Name"
    schema.lastname = "Test Lastname"

    mock_uow.analyst_repository.find_by_code.return_value = None
    
    role_entity = MagicMock()
    role_entity.is_active = True
    mock_uow.role_repository.find_by_id.return_value = role_entity
    
    hasher.hash.return_value = "hashed_secret"
    
    mock_uow.analyst_repository.create.return_value = MagicMock(code="C1000002")

    result = use_case.create(schema, "ADMIN_USER")

    mock_uow.analyst_repository.find_by_code.assert_called_with("C1000002")
    
    mock_uow.role_repository.find_by_id.assert_called_with(1)
    
    mock_uow.analyst_repository.create.assert_called_once()
    
    mock_uow.commit.assert_called_once()
    
    assert result.code == "C1000002"

def test_create_analyst_duplicate_code(mock_uow):
    hasher = Mock()
    use_case = CrudAnalystUseCase(mock_uow, hasher)
    
    mock_uow.analyst_repository.find_by_code.return_value = MagicMock() 

    schema = MagicMock()
    schema.code = "C1000002"
    schema.role_id = 1

    with pytest.raises(AnalystAlreadyExistsError):
        use_case.create(schema, "ADMIN")
    
    mock_uow.commit.assert_not_called()
    mock_uow.analyst_repository.create.assert_not_called()