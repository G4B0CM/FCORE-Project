class BehaviorProfileError(Exception):
    """Base exception for behavior profile errors."""
    pass

class BehaviorProfileNotFoundError(BehaviorProfileError):
    """Raised when a behavior profile is not found for a customer."""
    pass