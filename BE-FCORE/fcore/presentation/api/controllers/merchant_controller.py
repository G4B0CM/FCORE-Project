from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status

from ..dependencies import get_merchant_crud_use_case, get_current_active_analyst_entity
from ..schemas.merchant_schemas import MerchantCreate, MerchantUpdate, MerchantResponse
from ....application.use_cases.crud_merchant_use_case import CrudMerchantUseCase
from ....core.errors.merchant_errors import MerchantNotFoundError, MerchantAlreadyExistsError

router = APIRouter(
    prefix="/merchants",
    tags=["Merchants"],
    dependencies=[Depends(get_current_active_analyst_entity)] # Protect all routes
)

@router.post("/", response_model=MerchantResponse, status_code=status.HTTP_201_CREATED)
def create_merchant(
    merchant_in: MerchantCreate,
    use_case: CrudMerchantUseCase = Depends(get_merchant_crud_use_case)
):
    try:
        return use_case.create(name=merchant_in.name, category=merchant_in.category)
    except MerchantAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.get("/", response_model=List[MerchantResponse])
def get_all_merchants(use_case: CrudMerchantUseCase = Depends(get_merchant_crud_use_case)):
    return use_case.get_all()

@router.get("/{merchant_id}", response_model=MerchantResponse)
def get_merchant(
    merchant_id: UUID,
    use_case: CrudMerchantUseCase = Depends(get_merchant_crud_use_case)
):
    try:
        return use_case.get_by_id(merchant_id)
    except MerchantNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.put("/{merchant_id}", response_model=MerchantResponse)
def update_merchant(
    merchant_id: UUID,
    merchant_in: MerchantUpdate,
    use_case: CrudMerchantUseCase = Depends(get_merchant_crud_use_case)
):
    try:
        update_data = merchant_in.dict(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update.")
        return use_case.update(id=merchant_id, update_data=update_data)
    except MerchantNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except MerchantAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{merchant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_merchant(
    merchant_id: UUID,
    use_case: CrudMerchantUseCase = Depends(get_merchant_crud_use_case)
):
    try:
        use_case.delete(merchant_id)
    except MerchantNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))