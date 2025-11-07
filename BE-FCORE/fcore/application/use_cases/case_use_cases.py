from typing import List
from uuid import UUID
from ...core.entities.case import Case, CaseDecision
from ..interfaces.i_case_repository import ICaseRepository
from ..interfaces.i_alert_repository import IAlertRepository
from ...core.errors.case_errors import CaseNotFoundError, CaseAlreadyExistsError
from ...core.errors.alert_errors import AlertNotFoundError

class CaseUseCases:
    """Use cases for managing investigation cases."""

    def __init__(self, case_repository: ICaseRepository, alert_repository: IAlertRepository):
        self._case_repository = case_repository
        self._alert_repository = alert_repository

    def open_case_from_alert(self, alert_id: UUID, analyst_id: UUID) -> Case:
        if not self._alert_repository.find_by_id(alert_id):
            raise AlertNotFoundError(f"Alert with ID {alert_id} not found.")
        
        if self._case_repository.find_by_alert_id(alert_id):
            raise CaseAlreadyExistsError(f"A case for alert ID {alert_id} already exists.")

        new_case = Case(alert_id=alert_id, analyst_id=analyst_id)
        return self._case_repository.create(new_case)

    def get_case_by_id(self, id: UUID) -> Case:
        case = self._case_repository.find_by_id(id)
        if not case:
            raise CaseNotFoundError(f"Case with ID {id} not found.")
        return case

    def get_all_cases(self, limit: int, offset: int) -> List[Case]:
        return self._case_repository.get_all(limit, offset)

    def add_note_to_case(self, case_id: UUID, note: str, analyst_name: str) -> Case:
        case_to_update = self.get_case_by_id(case_id)
        case_to_update.add_note(note, analyst_name)
        return self._case_repository.update(case_to_update)

    def resolve_case(self, case_id: UUID, decision: CaseDecision) -> Case:
        case_to_update = self.get_case_by_id(case_id)
        case_to_update.resolve(decision)
        return self._case_repository.update(case_to_update)