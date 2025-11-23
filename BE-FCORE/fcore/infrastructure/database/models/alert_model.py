from sqlalchemy import Column, Float, DateTime, ForeignKey, Enum, ForeignKeyConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from uuid import uuid4
import datetime

from ....core.entities.alert import Alert, AlertAction
from .base_db_model import Base, UUID_CHAR

# For SQLite compatibility with JSONB
from sqlalchemy.types import JSON as FallbackJSON

JSONBType = JSONB().with_variant(FallbackJSON, "sqlite")

class AlertModel(Base):
    __tablename__ = 'alerts'
    
    id = Column(UUID_CHAR, primary_key=True, default=uuid4)
    
    transaction_id = Column(UUID_CHAR, nullable=False, index=True)
    transaction_occurred_at = Column(DateTime(timezone=True), nullable=False)
    
    action = Column(Enum(AlertAction), nullable=False)
    ml_score = Column(Float, nullable=True)
    final_score = Column(Float, nullable=True)
    rule_hits = Column(JSONBType, nullable=True)
    
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.datetime.utcnow)
    created_by = Column(UUID_CHAR, ForeignKey('analysts.id'), nullable=True)

    __table_args__ = (
        ForeignKeyConstraint(
            ['transaction_id', 'transaction_occurred_at'],
            ['transactions.id', 'transactions.occurred_at'],
        ),
    )

    transaction = relationship("TransactionModel", foreign_keys=[transaction_id, transaction_occurred_at])
    creator = relationship("AnalystModel")

    def to_entity(self) -> Alert:
        transaction_entity = self.transaction.to_entity() if self.transaction else None
        creator_entity = self.creator.to_entity() if self.creator else None
        
        return Alert(
            id=self.id,
            transaction_id=self.transaction_id,
            transaction_occurred_at=self.transaction_occurred_at, # Mapear nuevo campo
            action=self.action,
            ml_score=self.ml_score,
            final_score=self.final_score,
            rule_hits=self.rule_hits,
            created_at=self.created_at,
            created_by=self.created_by,
            transaction=transaction_entity,
            creator=creator_entity
        )