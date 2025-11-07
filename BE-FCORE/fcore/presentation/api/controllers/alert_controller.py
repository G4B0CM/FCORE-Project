from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query

from ..dependencies import get_alert_use_cases, get_current_active_analyst_entity
from ..schemas.alert_schemas import AlertResponse
from ....application.use_cases.alert_use_cases import AlertUseCases
from ....core.errors.alert_errors import AlertNotFoundError

router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"],
    dependencies=[Depends(get_current_active_analyst_entity)]
)

@router.get("/", response_model=List[AlertResponse])
def get_all_alerts(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    use_cases: AlertUseCases = Depends(get_alert_use_cases)
):
    return use_cases.get_all_alerts(limit, offset)

@router.get("/{alert_id}", response_model=AlertResponse)
def get_alert(
    alert_id: UUID,
    use_cases: AlertUseCases = Depends(get_alert_use_cases)
):
    try:
        return use_cases.get_alert_by_id(alert_id)
    except AlertNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))