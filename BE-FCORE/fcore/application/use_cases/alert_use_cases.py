from typing import List
from uuid import UUID
from ...core.entities.alert import Alert
from ..interfaces.i_alert_repository import IAlertRepository
from ...core.errors.alert_errors import AlertNotFoundError

class AlertUseCases:
    """Use cases for querying and managing alerts."""

    def __init__(self, alert_repository: IAlertRepository):
        self._alert_repository = alert_repository

    def get_alert_by_id(self, id: UUID) -> Alert:
        alert = self._alert_repository.find_by_id(id)
        if not alert:
            raise AlertNotFoundError(f"Alert with ID {id} not found.")
        return alert

    def get_all_alerts(self, limit: int, offset: int) -> List[Alert]:
        return self._alert_repository.get_all(limit, offset)

    # Note: The 'create_alert' use case will be part of the main 'DecisionUseCase'
    # It will take a transaction, run it through rules/ML, and then call
    # alert_repository.create() if needed. We don't expose its creation directly.