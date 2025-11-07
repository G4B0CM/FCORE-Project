from typing import List, Dict, Any
from ...core.entities.rule import Rule
from ...core.entities.transaction import Transaction
from ...core.entities.behavior_profile import BehaviorProfile

# RuleHit es una forma de registrar qué regla se activó.
# Podríamos usar un dataclass para hacerlo más robusto en el futuro.
RuleHit = Dict[str, Any]

class RuleEngine:
    """
    A simple, secure rule engine to evaluate transactions.
    This is a basic implementation. A real-world engine would use a proper parser
    for the DSL (e.g., using libraries like Lark or implementing a parser).
    """

    def __init__(self, rules: List[Rule]):
        """
        Initializes the engine with a list of enabled rules.
        """
        self._rules = [rule for rule in rules if rule.enabled]

    def evaluate(self, transaction: Transaction, behavior: BehaviorProfile) -> List[RuleHit]:
        """
        Evaluates the transaction and behavior profile against all loaded rules.
        """
        hits: List[RuleHit] = []
        
        # --- STUB IMPLEMENTATION ---
        # This is a very basic simulation. A real engine would parse the DSL.
        # We simulate hits based on keywords in the rule name for this demo.
        
        for rule in self._rules:
            triggered = False
            # Example 1: High amount rule
            if "high amount" in rule.name.lower() and transaction.amount > 2000:
                triggered = True
            
            # Example 2: Velocity rule
            if "velocity" in rule.name.lower() and behavior.tx_count_10m >= 4:
                triggered = True

            # Example 3: Unusual country
            if "unusual country" in rule.name.lower() and behavior.usual_country and transaction.country != behavior.usual_country:
                triggered = True
            
            if triggered:
                hits.append({
                    "rule_id": str(rule.id),
                    "rule_name": rule.name,
                    "severity": rule.severity.value
                })

        return hits