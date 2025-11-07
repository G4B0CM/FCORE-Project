class TransactionError(Exception):
    """Base exception for transaction-related errors."""
    pass

class TransactionValidationError(TransactionError):
    """Raised for validation errors in the Transaction entity."""
    pass

class TransactionNotFoundError(TransactionError):
    """Raised when a transaction is not found."""
    pass