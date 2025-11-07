from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status

from ..dependencies import get_customer_crud_use_case, get_current_active_analyst_entity
from ..schemas.customer_schemas import CustomerCreate, CustomerUpdate, CustomerResponse
from ....application.use_cases.crud_customer_use_case import CrudCustomerUseCase
from ....core.errors.customer_errors import CustomerNotFoundError, CustomerAlreadyExistsError

router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
    dependencies=[Depends(get_current_active_analyst_entity)] # Protect all routes
)

@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(
    customer_in: CustomerCreate,
    use_case: CrudCustomerUseCase = Depends(get_customer_crud_use_case)
):
    try:
        return use_case.create(
            full_name=customer_in.full_name,
            document_number=customer_in.document_number,
            segment=customer_in.segment,
            age=customer_in.age
        )
    except CustomerAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.get("/", response_model=List[CustomerResponse])
def get_all_customers(use_case: CrudCustomerUseCase = Depends(get_customer_crud_use_case)):
    return use_case.get_all()

@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(
    customer_id: UUID,
    use_case: CrudCustomerUseCase = Depends(get_customer_crud_use_case)
):
    try:
        return use_case.get_by_id(customer_id)
    except CustomerNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: UUID,
    customer_in: CustomerUpdate,
    use_case: CrudCustomerUseCase = Depends(get_customer_crud_use_case)
):
    try:
        update_data = customer_in.dict(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update provided."
            )
        return use_case.update(id=customer_id, update_data=update_data)
    except CustomerNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except CustomerAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: UUID,
    use_case: CrudCustomerUseCase = Depends(get_customer_crud_use_case)
):
    try:
        use_case.delete(customer_id)
    except CustomerNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))