from typing import List, Dict, Any
import logging
from simpleeval import SimpleEval, NameNotDefined

from ...core.entities.rule import Rule
from ...core.entities.transaction import Transaction
from ...core.entities.behavior_profile import BehaviorProfile

# Configurar logger para ver qué pasa con las reglas
logger = logging.getLogger(__name__)

RuleHit = Dict[str, Any]

class RuleEngine:
    """
    A secure rule engine that evaluates DSL expressions using simpleeval.
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

        context = self._build_context(transaction, behavior)

        evaluator = SimpleEval(names=context)

        for rule in self._rules:
            try:
                is_triggered = evaluator.eval(rule.dsl_expression)
                
                if is_triggered:
                    logger.info(f"Rule triggered: {rule.name}")
                    hits.append({
                        "rule_id": str(rule.id),
                        "rule_name": rule.name,
                        "dsl_expression": rule.dsl_expression,
                        "severity": rule.severity.value
                    })
            
            except (SyntaxError, NameNotDefined, Exception) as e:
                logger.error(f"Error evaluating rule '{rule.name}' (DSL: {rule.dsl_expression}): {str(e)}")
                continue

        return hits

    def _build_context(self, tx: Transaction, beh: BehaviorProfile) -> Dict[str, Any]:
        """
        Maps entity attributes to a flat dictionary for the DSL.
        """
        return {
            # --- Transaction Attributes ---
            "amount": float(tx.amount),
            "currency": tx.currency,
            "country": tx.country,
            "ip_address": tx.ip_address,
            "device_id": tx.device_id,
            "channel": tx.channel.value if tx.channel else None,
            
            # --- Behavior Attributes ---
            "tx_count_10m": beh.tx_count_10m,
            "tx_count_30m": beh.tx_count_30m,
            "tx_count_24h": beh.tx_count_24h,
            "avg_amount_24h": float(beh.avg_amount_24h),
            "usual_country": beh.usual_country,
            "usual_ip": beh.usual_ip,
            
            # --- Helper / Derived Logic (Optional) ---
            "is_foreign_transaction": tx.country != beh.usual_country if (tx.country and beh.usual_country) else False,
            "amount_ratio_vs_avg": (float(tx.amount) / float(beh.avg_amount_24h)) if beh.avg_amount_24h > 0 else 1.0,
            "is_blacklisted_merchant": tx.merchant.is_blacklisted if tx.merchant else False,
            "is_whitelisted_merchant": tx.merchant.is_whitelisted if tx.merchant else False
        }