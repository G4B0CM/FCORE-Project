from typing import List
from uuid import UUID
from ...core.entities.merchant import Merchant
from ..interfaces.i_merchant_repository import IMerchantRepository
from ...core.errors.merchant_errors import MerchantNotFoundError, MerchantAlreadyExistsError

class CrudMerchantUseCase:
    """Use case for CRUD operations on a Merchant."""
    
    def __init__(self, merchant_repository: IMerchantRepository):
        self._merchant_repository = merchant_repository

    def create(self, name: str, category: str) -> Merchant:
        if self._merchant_repository.find_by_name(name):
            raise MerchantAlreadyExistsError(f"Merchant with name '{name}' already exists.")
        
        merchant_entity = Merchant(name=name, category=category)
        return self._merchant_repository.create(merchant_entity)

    def get_by_id(self, id: UUID) -> Merchant:
        merchant = self._merchant_repository.find_by_id(id)
        if not merchant:
            raise MerchantNotFoundError(f"Merchant with ID {id} not found.")
        return merchant

    def get_all(self) -> List[Merchant]:
        return self._merchant_repository.get_all()

    def update(self, id: UUID, update_data: dict) -> Merchant:
        merchant_to_update = self.get_by_id(id)

        if 'name' in update_data and update_data['name'] != merchant_to_update.name:
            existing = self._merchant_repository.find_by_name(update_data['name'])
            if existing:
                raise MerchantAlreadyExistsError(f"Merchant with name '{update_data['name']}' already exists.")

        for key, value in update_data.items():
            if hasattr(merchant_to_update, key):
                setattr(merchant_to_update, key, value)
        
        merchant_to_update.__post_init__() # Re-validate
        return self._merchant_repository.update(merchant_to_update)

    def delete(self, id: UUID) -> bool:
        if not self._merchant_repository.find_by_id(id):
            raise MerchantNotFoundError(f"Merchant with ID {id} not found.")
        return self._merchant_repository.delete(id)