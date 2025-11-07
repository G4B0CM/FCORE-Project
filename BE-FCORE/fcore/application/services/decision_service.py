from typing import List, Tuple
from ...core.entities.alert import AlertAction
from .rule_engine import RuleHit

class DecisionService:
    """
    Combines rule hits and a model score to make a final decision.
    """

    def decide(self, ml_score: float, rule_hits: List[RuleHit]) -> Tuple[AlertAction, float]:
        """
        Makes a final decision based on policies and thresholds.
        Returns the final action and a final combined score.
        """
        final_score = ml_score

        # --- Policy 1: Critical rule hits lead to automatic decline ---
        for hit in rule_hits:
            if hit.get("severity") == "critical":
                return AlertAction.DECLINE, 1.0

        # --- Policy 2: Boost score based on rule hits ---
        # High severity hits have a higher impact on the final score
        score_boost = 0
        for hit in rule_hits:
            if hit.get("severity") == "high":
                score_boost += 0.25
            elif hit.get("severity") == "medium":
                score_boost += 0.10
        
        final_score = min(final_score + score_boost, 1.0)

        # --- Policy 3: Thresholds for final decision ---
        if final_score >= 0.90:
            return AlertAction.DECLINE, final_score
        elif final_score >= 0.75:
            return AlertAction.REVIEW, final_score
        else:
            return AlertAction.APPROVE, final_score