from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status

from ..dependencies import get_rule_crud_use_case, get_current_active_analyst_entity
from ..schemas.rule_schemas import RuleCreate, RuleUpdate, RuleResponse
from ....application.use_cases.crud_rule_use_case import CrudRuleUseCase
from ....core.entities.analyst import Analyst
from ....core.errors.rule_errors import RuleNotFoundError, RuleAlreadyExistsError

router = APIRouter(
    prefix="/rules",
    tags=["Rules"],
    dependencies=[Depends(get_current_active_analyst_entity)] # Rule management is for Admins only
)

@router.post("/", response_model=RuleResponse, status_code=status.HTTP_201_CREATED)
def create_rule(
    rule_in: RuleCreate,
    use_case: CrudRuleUseCase = Depends(get_rule_crud_use_case),
    current_user: Analyst = Depends(get_current_active_analyst_entity)
):
    try:
        return use_case.create(
            name=rule_in.name,
            dsl_expression=rule_in.dsl_expression,
            severity=rule_in.severity,
            created_by_code=current_user.code
        )
    except RuleAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.get("/", response_model=List[RuleResponse])
def get_all_rules(use_case: CrudRuleUseCase = Depends(get_rule_crud_use_case)):
    return use_case.get_all()

@router.get("/{rule_id}", response_model=RuleResponse)
def get_rule(
    rule_id: UUID,
    use_case: CrudRuleUseCase = Depends(get_rule_crud_use_case)
):
    try:
        return use_case.get_by_id(rule_id)
    except RuleNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.put("/{rule_id}", response_model=RuleResponse)
def update_rule(
    rule_id: UUID,
    rule_in: RuleUpdate,
    use_case: CrudRuleUseCase = Depends(get_rule_crud_use_case),
    current_user: Analyst = Depends(get_current_active_analyst_entity)
):
    try:
        update_data = rule_in.dict(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update.")
        return use_case.update(id=rule_id, update_data=update_data,
            modified_by_code=current_user.code)
    except RuleNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except RuleAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rule(
    rule_id: UUID,
    use_case: CrudRuleUseCase = Depends(get_rule_crud_use_case)
):
    try:
        use_case.delete(rule_id)
    except RuleNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))