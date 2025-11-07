from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status

from ..dependencies import get_behavior_use_cases, get_current_active_analyst_entity
from ..schemas.behavior_schemas import BehaviorProfileResponse
from ....application.use_cases.behavior_use_case import BehaviorUseCases
from ....core.errors.behavior_errors import BehaviorProfileNotFoundError

router = APIRouter(
    prefix="/behavior",
    tags=["Behavior Profiles"],
    dependencies=[Depends(get_current_active_analyst_entity)]
)

@router.get("/{customer_id}", response_model=BehaviorProfileResponse)
def get_customer_behavior_profile(
    customer_id: UUID,
    use_cases: BehaviorUseCases = Depends(get_behavior_use_cases)
):
    """
    Retrieves the aggregated behavior profile for a specific customer.
    """
    try:
        return use_cases.get_behavior_for_customer(customer_id)
    except BehaviorProfileNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))