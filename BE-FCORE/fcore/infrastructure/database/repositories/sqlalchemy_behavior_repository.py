from typing import Optional, Dict
from uuid import UUID
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, cast, Numeric

from ....core.entities.behavior_profile import BehaviorProfile
from ....application.interfaces.i_behavior_repository import IBehaviorRepository
from ..models.behavior_profile_model import BehaviorProfileModel
from ..models.transaction_model import TransactionModel

class SqlAlchemyBehaviorRepository(IBehaviorRepository):
    def __init__(self, session: Session):
        self._session = session

    def get_by_customer_id(self, customer_id: UUID) -> Optional[BehaviorProfile]:
        model = (
            self._session.query(BehaviorProfileModel)
            .options(joinedload(BehaviorProfileModel.customer))
            .filter_by(customer_id=customer_id)
            .first()
        )
        return model.to_entity() if model else None

    def save(self, profile: BehaviorProfile) -> BehaviorProfile:
        model = BehaviorProfileModel.from_entity(profile)
        merged_model = self._session.merge(model)
        self._session.flush()
        return merged_model.to_entity()

    def calculate_features_from_history(self, customer_id: UUID) -> Dict[str, any]:
        """
        Calculates aggregations directly from the Hypertable.
        This is much safer and more accurate than incremental updates in Python.
        """
        now = datetime.now(timezone.utc)

        def get_count(minutes_lookback: int):
            return (
                self._session.query(func.count(TransactionModel.id))
                .filter(
                    TransactionModel.customer_id == customer_id,
                    TransactionModel.occurred_at >= now - timedelta(minutes=minutes_lookback)
                )
                .scalar() or 0
            )

        # 1. Calculate Counts (Velocity)
        count_10m = get_count(10)
        count_30m = get_count(30)
        count_24h = get_count(1440)

        # 2. Calculate Average Amount (Last 24h)
        avg_24h = (
            self._session.query(func.avg(TransactionModel.amount))
            .filter(
                TransactionModel.customer_id == customer_id,
                TransactionModel.occurred_at >= now - timedelta(hours=24)
            )
            .scalar() or 0.0
        )

        # 3. Get Usual Country (Mode of countries in the last 30 days)
        usual_country = (
            self._session.query(TransactionModel.country)
            .filter(
                TransactionModel.customer_id == customer_id,
                TransactionModel.occurred_at >= now - timedelta(days=30)
            )
            .group_by(TransactionModel.country)
            .order_by(func.count(TransactionModel.country).desc())
            .limit(1)
            .scalar()
        )

        return {
            "tx_count_10m": count_10m,
            "tx_count_30m": count_30m,
            "tx_count_24h": count_24h,
            "avg_amount_24h": float(avg_24h),
            "usual_country": usual_country
        }