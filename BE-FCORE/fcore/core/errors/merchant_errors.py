class MerchantError(Exception):
    """Base exception for merchant-related errors."""
    pass

class MerchantValidationError(MerchantError):
    """Raised for validation errors in the Merchant entity."""
    pass

class MerchantNotFoundError(MerchantError):
    """Raised when a merchant is not found."""
    pass

class MerchantAlreadyExistsError(MerchantError):
    """Raised when trying to create a merchant that already exists."""
    pass