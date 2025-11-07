from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from ....core.entities.behavior_profile import BehaviorProfile
from ....application.interfaces.i_behavior_repository import IBehaviorRepository
from ..models.behavior_profile_model import BehaviorProfileModel

class SqlAlchemyBehaviorRepository(IBehaviorRepository):
    def __init__(self, session: Session):
        self._session = session

    def get_by_customer_id(self, customer_id: UUID) -> Optional[BehaviorProfile]:
        model = (
            self._session.query(BehaviorProfileModel)
            .options(joinedload(BehaviorProfileModel.customer)) # Eager load customer
            .filter_by(customer_id=customer_id)
            .first()
        )
        return model.to_entity() if model else None

    def save(self, profile: BehaviorProfile) -> BehaviorProfile:
        """Merges the state of the given profile into the session."""
        model = BehaviorProfileModel.from_entity(profile)
        merged_model = self._session.merge(model)
        self._session.flush()
        self._session.commit()
        return merged_model.to_entity()