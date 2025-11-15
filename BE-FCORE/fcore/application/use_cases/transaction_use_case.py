from typing import List
from uuid import UUID
from decimal import Decimal

from ...core.entities.transaction import Transaction, TransactionChannel
from ..interfaces.i_transaction_repository import ITransactionRepository
from ..interfaces.i_customer_repository import ICustomerRepository
from ..interfaces.i_merchant_repository import IMerchantRepository
from ...core.errors.customer_errors import CustomerNotFoundError
from ...core.errors.merchant_errors import MerchantNotFoundError
from ...core.errors.transaction_errors import TransactionNotFoundError

class TransactionUseCases:
    """Use cases for handling transactions."""
    
    def __init__(
        self,
        transaction_repository: ITransactionRepository,
        customer_repository: ICustomerRepository,
        merchant_repository: IMerchantRepository
    ):
        self._transaction_repository = transaction_repository
        self._customer_repository = customer_repository
        self._merchant_repository = merchant_repository

    def record_transaction(self, data: dict) -> Transaction:
        """
        Validates and records a new transaction.
        This is the primary use case for creating transactions.
        """
        customer_id = data.get('customer_id')
        merchant_id = data.get('merchant_id')

        # 1. Validate existence of related entities
        if not self._customer_repository.find_by_id(customer_id):
            raise CustomerNotFoundError(f"Customer with ID {customer_id} not found.")
        
        if not self._merchant_repository.find_by_id(merchant_id):
            raise MerchantNotFoundError(f"Merchant with ID {merchant_id} not found.")

        # 2. Create the entity
        transaction_entity = Transaction(
            customer_id=customer_id,
            merchant_id=merchant_id,
            amount=Decimal(data.get('amount')),
            channel=data.get('channel'),
            device_id=data.get('device_id'),
            ip_address=data.get('ip_address'),
            country=data.get('country')
        )
        
        # 3. Persist the entity
        return self._transaction_repository.create(transaction_entity)

    def get_transaction_by_id(self, id: UUID) -> Transaction:
        transaction = self._transaction_repository.find_by_id(id)
        if not transaction:
            raise TransactionNotFoundError(f"Transaction with ID {id} not found.")
        return transaction

    def get_all_transactions(self, limit: int, offset: int) -> List[Transaction]:
        return self._transaction_repository.get_all(limit, offset)