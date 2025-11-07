from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from ....core.entities.transaction import Transaction
from ....application.interfaces.i_transaction_repository import ITransactionRepository
from ..models.transaction_model import TransactionModel

class SqlAlchemyTransactionRepository(ITransactionRepository):
    def __init__(self, session: Session):
        self._session = session

    def create(self, transaction: Transaction) -> Transaction:
        model = TransactionModel.from_entity(transaction)
        self._session.add(model)
        self._session.flush()
        self._session.refresh(model, attribute_names=['customer', 'merchant'])
        self._session.commit()
        return model.to_entity()

    def find_by_id(self, id: UUID) -> Optional[Transaction]:
        model = (
            self._session.query(TransactionModel)
            .options(joinedload(TransactionModel.customer), joinedload(TransactionModel.merchant))
            .filter_by(id=id)
            .first()
        )
        return model.to_entity() if model else None

    def find_by_customer_id(self, customer_id: UUID) -> List[Transaction]:
        models = (
            self._session.query(TransactionModel)
            .filter_by(customer_id=customer_id)
            .order_by(TransactionModel.occurred_at.desc())
            .all()
        )
        return [model.to_entity() for model in models]

    def get_all(self, limit: int = 100, offset: int = 0) -> List[Transaction]:
        models = (
            self._session.query(TransactionModel)
            .order_by(TransactionModel.occurred_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        return [model.to_entity() for model in models]