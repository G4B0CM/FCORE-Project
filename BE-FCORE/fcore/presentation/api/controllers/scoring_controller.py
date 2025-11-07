from fastapi import APIRouter, Depends, HTTPException, status
from ....application.use_cases.transaction_use_case import TransactionUseCases # Re-use to create tx
from ....application.use_cases.scoring_use_case import ScoringUseCase
from ..schemas.transaction_schemas import TransactionCreate
from ..schemas.scoring_schemas import ScoringResponse # Create this new schema
from ....core.errors.customer_errors import CustomerNotFoundError
from ....core.errors.merchant_errors import MerchantNotFoundError

from ..dependencies import get_transaction_use_cases, get_scoring_use_case

router = APIRouter(
    prefix="/scoring",
    tags=["Scoring Engine"]
    # No analyst dependency needed if this is a system-to-system endpoint
)

@router.post("/score-transaction", response_model=ScoringResponse, status_code=status.HTTP_200_OK)
def score_transaction(
    tx_in: TransactionCreate,
    tx_use_cases: TransactionUseCases = Depends(get_transaction_use_cases),
    scoring_use_case: ScoringUseCase = Depends(get_scoring_use_case)
):
    """
    This endpoint simulates a real-time transaction authorization request.
    It records the transaction AND returns the fraud decision.
    """
    try:
        # 1. First, record the transaction to get a persistent entity
        transaction_entity = tx_use_cases.record_transaction(tx_in.dict())

        # 2. Execute the scoring pipeline with the created transaction
        action, details = scoring_use_case.execute(transaction_entity)
        
        return ScoringResponse(
            transaction_id=transaction_entity.id,
            action=action,
            ml_score=details['ml_score'],
            final_score=details['final_score'],
            rule_hits=details['rule_hits']
        )
    except (CustomerNotFoundError, MerchantNotFoundError) as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))