import random
from typing import Dict, Any
from ...application.interfaces.i_model_scorer import IModelScorer

class XgbScorerStub(IModelScorer):
    """
    A stub implementation of the XGBoost model scorer.
    This simulates the behavior of a real ML model for wiring purposes.
    """

    def score(self, features: Dict[str, Any]) -> float:
        """
        Calculates a simulated risk score.
        In a real implementation, this would load a model file (e.g., booster.json)
        and call model.predict().
        """
        base_score = 0.1 # Base risk for any transaction

        if features.get("amount", 0) > 1500:
            base_score += 0.3
        
        if features.get("tx_count_10m", 0) > 3:
            base_score += 0.4

        if features.get("is_new_country", False):
            base_score += 0.25

        # Ensure the score is within the [0, 1] range
        final_score = min(base_score + (random.random() * 0.1), 1.0)
        
        return round(final_score, 4)