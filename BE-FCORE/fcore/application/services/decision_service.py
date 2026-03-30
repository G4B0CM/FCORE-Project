from typing import List, Tuple
from ...core.entities.alert import AlertAction
from .rule_engine import RuleHit

class DecisionService:


    def decide(self, ml_score: float, rule_hits: List[RuleHit]) -> Tuple[AlertAction, float]:

        final_score = ml_score

        for hit in rule_hits:
            if hit.get("severity") == "critical":
                return AlertAction.DECLINE, 1.0

        score_boost = 0
        for hit in rule_hits:
            if hit.get("severity") == "high":
                score_boost += 0.25
            elif hit.get("severity") == "medium":
                score_boost += 0.10
        
        final_score = min(final_score + score_boost, 1.0)

        if final_score >= 0.90:
            return AlertAction.DECLINE, final_score
        elif final_score >= 0.75:
            return AlertAction.REVIEW, final_score
        else:
            return AlertAction.APPROVE, final_score