from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query

from ..dependencies import get_transaction_use_cases, get_current_active_analyst_entity
from ..schemas.transaction_schemas import TransactionCreate, TransactionResponse
from ....application.use_cases.transaction_use_case import TransactionUseCases
from ....core.errors.customer_errors import CustomerNotFoundError
from ....core.errors.merchant_errors import MerchantNotFoundError
from ....core.errors.transaction_errors import TransactionNotFoundError

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
    dependencies=[Depends(get_current_active_analyst_entity)]
)

@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def record_new_transaction(
    tx_in: TransactionCreate,
    use_cases: TransactionUseCases = Depends(get_transaction_use_cases)
):
    try:
        data = tx_in.dict()
        recorded_tx = use_cases.record_transaction(data)
        return recorded_tx
    except (CustomerNotFoundError, MerchantNotFoundError) as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/", response_model=List[TransactionResponse])
def get_all_transactions(
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    use_cases: TransactionUseCases = Depends(get_transaction_use_cases)
):
    return use_cases.get_all_transactions(limit, offset)

@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(
    transaction_id: UUID,
    use_cases: TransactionUseCases = Depends(get_transaction_use_cases)
):
    try:
        return use_cases.get_transaction_by_id(transaction_id)
    except TransactionNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))