from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ....core.entities.merchant import Merchant
from ....application.interfaces.i_merchant_repository import IMerchantRepository
from ..models.merchant_model import MerchantModel
from ....core.errors.merchant_errors import MerchantAlreadyExistsError

class SqlAlchemyMerchantRepository(IMerchantRepository):
    def __init__(self, session: Session):
        self._session = session

    def create(self, merchant: Merchant) -> Merchant:
        merchant_model = MerchantModel.from_entity(merchant)
        try:
            self._session.add(merchant_model)
            self._session.flush()
            self._session.commit()
            return merchant_model.to_entity()
        except IntegrityError:
            self._session.rollback()
            raise MerchantAlreadyExistsError(f"Merchant with name '{merchant.name}' already exists.")

    def find_by_id(self, id: UUID) -> Optional[Merchant]:
        model = self._session.query(MerchantModel).filter_by(id=id).first()
        return model.to_entity() if model else None

    def find_by_name(self, name: str) -> Optional[Merchant]:
        model = self._session.query(MerchantModel).filter_by(name=name).first()
        return model.to_entity() if model else None

    def get_all(self) -> List[Merchant]:
        models = self._session.query(MerchantModel).all()
        return [model.to_entity() for model in models]

    def update(self, merchant: Merchant) -> Merchant:
        model = self._session.query(MerchantModel).filter_by(id=merchant.id).first()
        if model:
            model.name = merchant.name
            model.category = merchant.category
            model.risk_level = merchant.risk_level
            model.is_whitelisted = merchant.is_whitelisted
            model.is_blacklisted = merchant.is_blacklisted
            self._session.flush()
            self._session.commit()
            return model.to_entity()
        return None

    def delete(self, id: UUID) -> bool:
        model = self._session.query(MerchantModel).filter_by(id=id).first()
        if model:
            self._session.delete(model)
            self._session.flush()
            self._session.commit()
            return True
        return False