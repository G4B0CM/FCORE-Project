from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query

from ..dependencies import get_case_use_cases, get_current_active_analyst_entity
from ..schemas.case_schemas import CaseOpen, CaseAddNote, CaseResolve, CaseResponse
from ....application.use_cases.case_use_cases import CaseUseCases
from ....core.errors.case_errors import CaseNotFoundError, CaseAlreadyExistsError
from ....core.errors.alert_errors import AlertNotFoundError
from ....core.entities.analyst import Analyst

router = APIRouter(
    prefix="/cases",
    tags=["Cases"],
    dependencies=[Depends(get_current_active_analyst_entity)]
)

@router.post("/", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
def open_case(
    case_in: CaseOpen,
    use_cases: CaseUseCases = Depends(get_case_use_cases),
    current_analyst: Analyst = Depends(get_current_active_analyst_entity)
):
    try:
        return use_cases.open_case_from_alert(
            alert_id=case_in.alert_id,
            analyst_id=current_analyst.id
        )
    except AlertNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except CaseAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.get("/", response_model=List[CaseResponse])
def get_all_cases(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    use_cases: CaseUseCases = Depends(get_case_use_cases)
):
    return use_cases.get_all_cases(limit, offset)

@router.get("/{case_id}", response_model=CaseResponse)
def get_case(case_id: UUID, use_cases: CaseUseCases = Depends(get_case_use_cases)):
    try:
        return use_cases.get_case_by_id(case_id)
    except CaseNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.patch("/{case_id}/notes", response_model=CaseResponse)
def add_note(
    case_id: UUID,
    note_in: CaseAddNote,
    use_cases: CaseUseCases = Depends(get_case_use_cases),
    current_analyst: Analyst = Depends(get_current_active_analyst_entity)
):
    try:
        return use_cases.add_note_to_case(
            case_id=case_id,
            note=note_in.note,
            analyst_name=current_analyst.name
        )
    except CaseNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.patch("/{case_id}/resolve", response_model=CaseResponse)
def resolve_case(
    case_id: UUID,
    resolution: CaseResolve,
    use_cases: CaseUseCases = Depends(get_case_use_cases)
):
    try:
        return use_cases.resolve_case(case_id=case_id, decision=resolution.decision)
    except CaseNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))