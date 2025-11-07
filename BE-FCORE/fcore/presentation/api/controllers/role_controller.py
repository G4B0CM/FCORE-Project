from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status

from ..dependencies import get_role_crud_use_case, is_admin
from ..schemas.role_schemas import RoleCreate, RoleUpdate, RoleResponse
from ....application.use_cases.crud_role_use_case import CrudRoleUseCase
from ....core.errors.roles_errors import RoleNotFoundError, RoleAlreadyExistsError

router = APIRouter(
    prefix="/roles",
    tags=["Roles"],
    dependencies=[Depends(is_admin)] # Protect all role routes, only for admins
)

@router.post("/", response_model=RoleResponse, status_code=status.HTTP_201_CREATED)
def create_role(
    role_in: RoleCreate,
    use_case: CrudRoleUseCase = Depends(get_role_crud_use_case)
):
    try:
        created_role = use_case.create(name=role_in.name, description=role_in.description)
        return created_role
    except RoleAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.get("/", response_model=List[RoleResponse])
def get_all_roles(
    use_case: CrudRoleUseCase = Depends(get_role_crud_use_case)
):
    return use_case.get_all()

@router.get("/{role_id}", response_model=RoleResponse)
def get_role_by_id(
    role_id: UUID,
    use_case: CrudRoleUseCase = Depends(get_role_crud_use_case)
):
    try:
        role = use_case.get_by_id(role_id)
        return role
    except RoleNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.put("/{role_id}", response_model=RoleResponse)
def update_role(
    role_id: UUID,
    role_in: RoleUpdate,
    use_case: CrudRoleUseCase = Depends(get_role_crud_use_case)
):
    try:
        updated_role = use_case.update(
            id=role_id,
            name=role_in.name,
            description=role_in.description,
            is_active=role_in.is_active
        )
        return updated_role
    except RoleNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except RoleAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_role(
    role_id: UUID,
    use_case: CrudRoleUseCase = Depends(get_role_crud_use_case)
):
    try:
        if not use_case.delete(role_id):
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete role.")
    except RoleNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))