class CustomerError(Exception):
    """Base exception for customer-related errors."""
    pass

class CustomerValidationError(CustomerError):
    """Raised for validation errors in the Customer entity."""
    pass

class CustomerNotFoundError(CustomerError):
    """Raised when a customer is not found."""
    pass

class CustomerAlreadyExistsError(CustomerError):
    """Raised when trying to create a customer that already exists."""
    pass