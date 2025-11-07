from sqlalchemy import Column, String, Boolean, DateTime, Enum
from uuid import uuid4
import datetime

from ....core.entities.rule import Rule, RuleSeverity
from .base_db_model import Base, UUID_CHAR

class RuleModel(Base):
    __tablename__ = 'rules'
    
    id = Column(UUID_CHAR, primary_key=True, default=uuid4)
    name = Column(String(150), nullable=False, unique=True, index=True)
    dsl_expression = Column(String(1024), nullable=False)
    severity = Column(Enum(RuleSeverity), nullable=False, default=RuleSeverity.MEDIUM)
    enabled = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.datetime.utcnow)
    created_by = Column(String(12), nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=True, onupdate=datetime.datetime.utcnow)
    updated_by = Column(String(12), nullable=True)
    
    def to_entity(self) -> Rule:
        rule = Rule(
            id=self.id,
            name=self.name,
            dsl_expression=self.dsl_expression,
            severity=self.severity,
            enabled=self.enabled,
            created_at=self.created_at,
            created_by= self.created_by
        )
        rule.updated_at = self.updated_at
        rule.updated_by = self.updated_by
        return rule

    @staticmethod
    def from_entity(rule: Rule) -> "RuleModel":
        return RuleModel(
            id=rule.id,
            name=rule.name,
            dsl_expression=rule.dsl_expression,
            severity=rule.severity,
            enabled=rule.enabled,
            created_at=rule.created_at,
            created_by = rule.created_by,
            updated_at=rule.updated_at,
            updated_by = rule.updated_by
        )