class CaseError(Exception):
    """Base exception for case-related errors."""
    pass

class CaseValidationError(CaseError):
    """Raised for validation errors in the Case entity."""
    pass

class CaseNotFoundError(CaseError):
    """Raised when a case is not found."""
    pass

class CaseAlreadyExistsError(CaseError):
    """Raised when trying to open a case for an alert that already has one."""
    pass