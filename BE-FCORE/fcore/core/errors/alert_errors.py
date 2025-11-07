class AlertError(Exception):
    """Base exception for alert-related errors."""
    pass

class AlertNotFoundError(AlertError):
    """Raised when an alert is not found."""
    pass

class AlertUpdateError(AlertError):
    """Raised on failure to update an alert."""
    pass