from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError

from ....core.entities.analyst import Analyst
from ....application.interfaces.i_analyst_repository import IAnalystRepository
from ..models.analyst_model import AnalystModel
from ....core.errors.analyst_errors import AnalystAlreadyExistsError

class SqlAlchemyAnalystRepository(IAnalystRepository):
    """
    Concrete implementation of the Analyst repository using SQLAlchemy.
    It operates within a session provided by a Unit of Work.
    """
    def __init__(self, session: Session):
        self._session = session

    def create(self, analyst: Analyst) -> Analyst:
        """Creates and saves a new Analyst."""
        new_analyst_model = AnalystModel.from_entity(analyst)
        try:
            self._session.add(new_analyst_model)
            self._session.flush()
            self._session.commit()
            return new_analyst_model.to_entity()
        except IntegrityError:
            self._session.rollback() # Important to rollback on integrity errors
            raise AnalystAlreadyExistsError(f"Analyst with code '{analyst.code}' already exists.")

    def find_by_code(self, code: str) -> Optional[Analyst]:
        """Finds an Analyst by code, eagerly loading the role."""
        analyst_model = (
            self._session.query(AnalystModel)
            .options(joinedload(AnalystModel.role))
            .filter_by(code=code)
            .first()
        )
        return analyst_model.to_entity() if analyst_model else None

    def find_by_id(self, id: UUID) -> Optional[Analyst]:
        """Finds an Analyst by UUID, eagerly loading the role."""
        analyst_model = (
            self._session.query(AnalystModel)
            .options(joinedload(AnalystModel.role))
            .filter_by(id=id)
            .first()
        )
        return analyst_model.to_entity() if analyst_model else None

    def get_all(self) -> List[Analyst]:
        """Retrieves all Analysts, eagerly loading their roles."""
        all_analyst_models = (
            self._session.query(AnalystModel)
            .options(joinedload(AnalystModel.role))
            .all()
        )
        return [model.to_entity() for model in all_analyst_models]

    def update(self, analyst: Analyst) -> Analyst:
        """Updates an existing analyst's data."""
        analyst_model = self._session.query(AnalystModel).filter_by(id=analyst.id).first()
        if analyst_model:
            analyst_model.name = analyst.name
            analyst_model.lastname = analyst.lastname
            analyst_model.password_hash = analyst.password_hash
            analyst_model.is_active = analyst.is_active
            analyst_model.role_id = analyst.role.id
            analyst_model.updated_at = analyst.updated_at
            analyst_model.updated_by = analyst.updated_by
            
            self._session.flush()
            self._session.commit()
            return analyst_model.to_entity()
        # In a strict system, you might raise an error if the analyst to update is not found.
        return None

    def deactivate(self, code: str) -> Optional[Analyst]:
        """
        Performs a soft delete by setting is_active to False.
        """
        analyst_model = self._session.query(AnalystModel).filter_by(code=code).first()
        if analyst_model:
            analyst_model.is_active = False
            self._session.flush()
            self._session.refresh(analyst_model, attribute_names=['role'])
            self._session.commit()
            return analyst_model.to_entity()
        return None