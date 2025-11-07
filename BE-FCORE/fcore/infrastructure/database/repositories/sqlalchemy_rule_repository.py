from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ....core.entities.rule import Rule
from ....application.interfaces.i_rule_repository import IRuleRepository
from ..models.rule_model import RuleModel
from ....core.errors.rule_errors import RuleAlreadyExistsError

class SqlAlchemyRuleRepository(IRuleRepository):
    def __init__(self, session: Session):
        self._session = session

    def create(self, rule: Rule) -> Rule:
        model = RuleModel.from_entity(rule)
        try:
            self._session.add(model)
            self._session.flush()
            self._session.commit()
            return model.to_entity()
        except IntegrityError:
            self._session.rollback()
            raise RuleAlreadyExistsError(f"Rule with name '{rule.name}' already exists.")

    def find_by_id(self, id: UUID) -> Optional[Rule]:
        model = self._session.query(RuleModel).filter_by(id=id).first()
        return model.to_entity() if model else None

    def find_by_name(self, name: str) -> Optional[Rule]:
        model = self._session.query(RuleModel).filter_by(name=name).first()
        return model.to_entity() if model else None

    def get_all(self, only_enabled: bool = False) -> List[Rule]:
        query = self._session.query(RuleModel)
        if only_enabled:
            query = query.filter_by(enabled=True)
        models = query.order_by(RuleModel.name).all()
        return [model.to_entity() for model in models]

    def update(self, rule: Rule) -> Rule:
        model = self._session.query(RuleModel).filter_by(id=rule.id).first()
        if model:
            model.name = rule.name
            model.dsl_expression = rule.dsl_expression
            model.severity = rule.severity
            model.enabled = rule.enabled
            model.updated_at = rule.updated_at
            model.updated_by = rule.updated_by
            self._session.flush()
            self._session.commit()
            return model.to_entity()
        return None

    def delete(self, id: UUID) -> bool:
        model = self._session.query(RuleModel).filter_by(id=id).first()
        if model:
            self._session.delete(model)
            self._session.flush()
            return True
        return False