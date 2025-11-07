class RuleError(Exception):
    """Base exception for rule-related errors."""
    pass

class RuleValidationError(RuleError):
    """Raised for validation errors in the Rule entity."""
    pass

class RuleNotFoundError(RuleError):
    """Raised when a rule is not found."""
    pass

class RuleAlreadyExistsError(RuleError):
    """Raised when trying to create a rule with a name that already exists."""
    pass