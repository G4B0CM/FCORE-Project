from typing import List
from fastapi import APIRouter, Depends, HTTPException

from ...api.dependencies import get_analyst_crud_use_case, get_current_active_analyst_entity, is_admin
from ...api.schemas.analyst_schemas import AnalystCreate, AnalystUpdate, AnalystResponse
from ....application.use_cases.crud_analyst_use_case import CrudAnalystUseCase
from ....core.entities.analyst import Analyst
from ....core.errors.analyst_errors import AnalystNotFoundError, AnalystAlreadyExistsError

router = APIRouter(
    prefix="/analysts",
    tags=["Analysts"],
    dependencies=[Depends(get_current_active_analyst_entity)] # Protect all routes in this controller
)

@router.post("/", response_model=AnalystResponse, status_code=201, dependencies=[Depends(is_admin)])
def create_analyst(
    analyst_in: AnalystCreate,
    use_case: CrudAnalystUseCase = Depends(get_analyst_crud_use_case),
    current_user: Analyst = Depends(get_current_active_analyst_entity)
):
    try:
        # Pass the current user's code as the 'created_by' field
        created_analyst = use_case.create(analyst_in, created_by_code=current_user.code)
        return created_analyst
    except AnalystAlreadyExistsError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.get("/", response_model=List[AnalystResponse])
def get_all_analysts(
    use_case: CrudAnalystUseCase = Depends(get_analyst_crud_use_case)
):
    return use_case.get_all()

@router.get("/{code}", response_model=AnalystResponse)
def get_analyst_by_code(
    code: str,
    use_case: CrudAnalystUseCase = Depends(get_analyst_crud_use_case)
):
    try:
        analyst = use_case.get_by_code(code)
        return analyst
    except AnalystNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.put("/{code}", response_model=AnalystResponse, status_code=201, dependencies=[Depends(is_admin)])
def update_analyst(
    code: str,
    analyst_in: AnalystUpdate,
    use_case: CrudAnalystUseCase = Depends(get_analyst_crud_use_case),
    current_user: Analyst = Depends(get_current_active_analyst_entity)
):
    try:
        # Pass the current user's code as the 'created_by' field
        updated_analyst = use_case.update(code,analyst_in, modified_by_code=current_user.code)
        return updated_analyst
    except AnalystAlreadyExistsError as e:
        raise HTTPException(status_code=409, detail=str(e))
    
@router.post("/deactivate/{code}", response_model=AnalystResponse)
def deactivate_analyst(
    code: str,
    use_case: CrudAnalystUseCase = Depends(get_analyst_crud_use_case),
    current_user: Analyst = Depends(get_current_active_analyst_entity)
):
    try:
        analyst = use_case.deactivate(code,current_user.code)
        return analyst
    except AnalystNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))