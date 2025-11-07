from abc import ABC, abstractmethod
from typing import Dict, Any

class IModelScorer(ABC):
    """
    Interface for a machine learning model scorer.
    """

    @abstractmethod
    def score(self, features: Dict[str, Any]) -> float:
        """
        Calculates a risk score based on a feature vector.
        Returns a score between 0.0 (no risk) and 1.0 (high risk).
        """
        pass