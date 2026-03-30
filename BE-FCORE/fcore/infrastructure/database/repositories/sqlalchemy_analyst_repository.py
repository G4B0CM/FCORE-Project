from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
# No more explicit IntegrityError catch/rollback here; let UoW or UseCase handle logic
from ....core.entities.analyst import Analyst
from ....application.interfaces.i_analyst_repository import IAnalystRepository
from ..models.analyst_model import AnalystModel

class SqlAlchemyAnalystRepository(IAnalystRepository):
    """
    Repository now acts purely as a collection interface.
    Transaction management is delegated to the Unit of Work.
    """
    def __init__(self, session: Session):
        self._session = session

    def create(self, analyst: Analyst) -> Analyst:
        new_analyst_model = AnalystModel.from_entity(analyst)
        self._session.add(new_analyst_model)
        self._session.flush() # Flush to get ID if needed, but DO NOT COMMIT
        return new_analyst_model.to_entity()

    def find_by_code(self, code: str) -> Optional[Analyst]:
        analyst_model = (
            self._session.query(AnalystModel)
            .options(joinedload(AnalystModel.role))
            .filter_by(code=code)
            .first()
        )
        return analyst_model.to_entity() if analyst_model else None

    def find_by_id(self, id: UUID) -> Optional[Analyst]:
        analyst_model = (
            self._session.query(AnalystModel)
            .options(joinedload(AnalystModel.role))
            .filter_by(id=id)
            .first()
        )
        return analyst_model.to_entity() if analyst_model else None

    def get_all(self) -> List[Analyst]:
        all_analyst_models = (
            self._session.query(AnalystModel)
            .options(joinedload(AnalystModel.role))
            .all()
        )
        return [model.to_entity() for model in all_analyst_models]

    def update(self, analyst: Analyst) -> Analyst:
        analyst_model = self._session.query(AnalystModel).filter_by(id=analyst.id).first()
        if analyst_model:
            analyst_model.name = analyst.name
            analyst_model.lastname = analyst.lastname
            analyst_model.password_hash = analyst.password_hash
            analyst_model.is_active = analyst.is_active
            analyst_model.role_id = analyst.role.id
            analyst_model.updated_at = analyst.updated_at
            analyst_model.updated_by = analyst.updated_by
            
            self._session.flush() # Flush pending changes
            return analyst_model.to_entity()
        return None

    def deactivate(self, code: str) -> Optional[Analyst]:
        analyst_model = self._session.query(AnalystModel).filter_by(code=code).first()
        if analyst_model:
            analyst_model.is_active = False
            self._session.flush()
            self._session.refresh(analyst_model, attribute_names=['role'])
            return analyst_model.to_entity()
        return None