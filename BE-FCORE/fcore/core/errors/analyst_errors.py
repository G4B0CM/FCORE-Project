class AnalystExepctions(Exception):
    """Lanzado cuando fallan las reglas de negocio de Analyst"""
    pass

class AnalystValidationError(AnalystExepctions):
    """Lanzado cuando los campos del Analyst no son válidos"""
    pass

class AnalystNotFoundError(AnalystExepctions):
    """Lanzado cuando no se encontro un Analyst"""
    pass

class AnalystAlreadyExistsError(AnalystExepctions):
    """Lanzado cuando se intenta registrar un Analyst que ya existe"""
    pass

class AnalystNotInAuthError(AnalystExepctions):
    """Lanzado cuando no se envía un mensaje correctamente"""
    pass

class NotMatchingTurnEnumError(AnalystExepctions):
    """Lanzado cuando no hace match el valor de un enum 'Turn' en la base de datos, no corresponde a uno del sistema."""
    pass

class NotMatchingFreeDaysEnumError(AnalystExepctions):
    """Lanzado cuando no hace match el valor de un enum 'FreeDays' en la base de datos, no corresponde a uno del sistema."""
    pass

class NotMatchingTurnValueError(AnalystExepctions):
    """Lanzado cuando no hace match el enum 'Turn'con un valor del sistema."""
    pass

class NotMatchingFreeDaysValueError(AnalystExepctions):
    """Lanzado cuando no hace match el enum 'FreeDays'con un valor del sistema."""
    pass

class AnalystAlreadyDeactivatedError(AnalystExepctions):
    """Lanzado cuando no hace match el enum 'FreeDays'con un valor del sistema."""
    pass