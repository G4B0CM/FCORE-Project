from abc import ABC, abstractmethod
from typing import Dict, Any
from ...core.entities.rule import Rule

class IRuleEvaluator(ABC):
    """
    Strategy Interface: Defines how a rule should be evaluated.
    Different implementations can handle DSLs, Python scripts, or external calls.
    """

    @abstractmethod
    def evaluate(self, rule: Rule, context: Dict[str, Any]) -> bool:
        """
        Evaluates a single rule against a given context.
        Returns True if the rule is triggered, False otherwise.
        """
        pass