from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from ....core.entities.case import Case
from ....application.interfaces.i_case_repository import ICaseRepository
from ..models.case_model import CaseModel
from ..models.alert_model import AlertModel
from ....core.errors.case_errors import CaseAlreadyExistsError

class SqlAlchemyCaseRepository(ICaseRepository):
    def __init__(self, session: Session):
        self._session = session

    def create(self, case: Case) -> Case:
        model = CaseModel(
            id=case.id,
            alert_id=case.alert_id,
            analyst_id=case.analyst_id,
            decision=case.decision,
            notes=case.notes,
            created_at=case.created_at,
            updated_at=case.updated_at
        )
        try:
            self._session.add(model)
            self._session.flush()
            return self.find_by_id(model.id)
        except IntegrityError:
            self._session.rollback()
            raise CaseAlreadyExistsError(f"A case for alert ID {case.alert_id} already exists.")

    def _get_eager_loading_options(self):
        return [
            joinedload(CaseModel.analyst),
            joinedload(CaseModel.alert).joinedload(AlertModel.transaction)
        ]

    def find_by_id(self, id: UUID) -> Optional[Case]:
        model = (
            self._session.query(CaseModel)
            .options(*self._get_eager_loading_options())
            .filter_by(id=id)
            .first()
        )
        return model.to_entity() if model else None

    def find_by_alert_id(self, alert_id: UUID) -> Optional[Case]:
        model = (
            self._session.query(CaseModel)
            .options(*self._get_eager_loading_options())
            .filter_by(alert_id=alert_id)
            .first()
        )
        return model.to_entity() if model else None
    
    def get_all(self, limit: int = 100, offset: int = 0) -> List[Case]:
        models = (
            self._session.query(CaseModel)
            .order_by(CaseModel.updated_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        return [model.to_entity() for model in models]

    def update(self, case: Case) -> Case:
        model = self._session.query(CaseModel).filter_by(id=case.id).first()
        if model:
            model.decision = case.decision
            model.notes = case.notes
            model.updated_at = case.updated_at
            self._session.flush()
            return self.find_by_id(model.id)
        return None