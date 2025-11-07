from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from ....core.entities.alert import Alert
from ....application.interfaces.i_alert_repository import IAlertRepository
from ..models.alert_model import AlertModel
from ..models.transaction_model import TransactionModel

class SqlAlchemyAlertRepository(IAlertRepository):
    def __init__(self, session: Session):
        self._session = session

    def create(self, alert: Alert) -> Alert:
        model = AlertModel(
            id=alert.id,
            transaction_id=alert.transaction_id,
            action=alert.action,
            ml_score=alert.ml_score,
            final_score=alert.final_score,
            rule_hits=alert.rule_hits,
            created_at=alert.created_at,
            created_by=alert.created_by
        )
        self._session.add(model)
        self._session.flush()
        self._session.commit()
        return self.find_by_id(model.id)

    def find_by_id(self, id: UUID) -> Optional[Alert]:
        model = (
            self._session.query(AlertModel)
            .options(
                joinedload(AlertModel.transaction).joinedload(TransactionModel.customer),
                joinedload(AlertModel.transaction).joinedload(TransactionModel.merchant),
                joinedload(AlertModel.creator)
            )
            .filter_by(id=id)
            .first()
        )
        return model.to_entity() if model else None

    def get_all(self, limit: int = 100, offset: int = 0) -> List[Alert]:
        models = (
            self._session.query(AlertModel)
            .order_by(AlertModel.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        # This will cause N+1 queries. For a real app, eager loading would be needed here too.
        # For simplicity, we'll leave it for now.
        return [model.to_entity() for model in models]