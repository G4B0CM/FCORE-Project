from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from uuid import uuid4
import datetime

from ....core.entities.case import Case, CaseDecision
from .base_db_model import Base, UUID_CHAR

class CaseModel(Base):
    __tablename__ = 'cases'
    
    id = Column(UUID_CHAR, primary_key=True, default=uuid4)
    alert_id = Column(UUID_CHAR, ForeignKey('alerts.id'), nullable=False, unique=True, index=True)
    analyst_id = Column(UUID_CHAR, ForeignKey('analysts.id'), nullable=False, index=True)
    
    decision = Column(Enum(CaseDecision), nullable=False, default=CaseDecision.PENDING)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    alert = relationship("AlertModel", backref="case", uselist=False)
    analyst = relationship("AnalystModel")

    def to_entity(self) -> Case:
        return Case(
            id=self.id,
            alert_id=self.alert_id,
            analyst_id=self.analyst_id,
            decision=self.decision,
            notes=self.notes,
            created_at=self.created_at,
            updated_at=self.updated_at,
            alert=self.alert.to_entity() if self.alert else None,
            analyst=self.analyst.to_entity() if self.analyst else None
        )