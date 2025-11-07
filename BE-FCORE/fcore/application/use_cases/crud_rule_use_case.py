from typing import List
from uuid import UUID
from datetime import datetime
from ...core.entities.rule import Rule, RuleSeverity
from ..interfaces.i_rule_repository import IRuleRepository
from ...core.errors.rule_errors import RuleNotFoundError, RuleAlreadyExistsError

class CrudRuleUseCase:
    """Use case for CRUD operations on a Rule."""
    
    def __init__(self, rule_repository: IRuleRepository):
        self._rule_repository = rule_repository

    def create(self, name: str, dsl_expression: str, severity: RuleSeverity, created_by_code: str) -> Rule:
        if self._rule_repository.find_by_name(name):
            raise RuleAlreadyExistsError(f"Rule with name '{name}' already exists.")
        
        rule_entity = Rule(
            name=name, 
            dsl_expression=dsl_expression, 
            severity=severity, 
            created_at=datetime.utcnow(),
            created_by=created_by_code)
        return self._rule_repository.create(rule_entity)

    def get_by_id(self, id: UUID) -> Rule:
        rule = self._rule_repository.find_by_id(id)
        if not rule:
            raise RuleNotFoundError(f"Rule with ID {id} not found.")
        return rule

    def get_all(self) -> List[Rule]:
        return self._rule_repository.get_all()

    def update(self, id: UUID, update_data: dict, modified_by_code: str) -> Rule:
        rule_to_update = self.get_by_id(id)

        if 'name' in update_data and update_data['name'] != rule_to_update.name:
            existing = self._rule_repository.find_by_name(update_data['name'])
            if existing:
                raise RuleAlreadyExistsError(f"Rule with name '{update_data['name']}' already exists.")

        for key, value in update_data.items():
            if hasattr(rule_to_update, key):
                setattr(rule_to_update, key, value)
        
        rule_to_update.updated_at = datetime.utcnow()
        rule_to_update.updated_by = modified_by_code
        rule_to_update.__post_init__()
        return self._rule_repository.update(rule_to_update)

    def delete(self, id: UUID) -> bool:
        if not self._rule_repository.find_by_id(id):
            raise RuleNotFoundError(f"Rule with ID {id} not found.")
        return self._rule_repository.delete(id)