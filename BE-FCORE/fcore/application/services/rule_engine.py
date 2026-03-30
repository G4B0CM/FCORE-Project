from typing import List, Dict, Any
import logging

from ...core.entities.rule import Rule
from ...core.entities.transaction import Transaction
from ...core.entities.behavior_profile import BehaviorProfile
from ..interfaces.i_rule_evaluator import IRuleEvaluator

logger = logging.getLogger(__name__)

RuleHit = Dict[str, Any]

class RuleEngine:


    def __init__(self, rules: List[Rule], evaluator: IRuleEvaluator):

        self._rules = [rule for rule in rules if rule.enabled]
        self._evaluator = evaluator

    def evaluate(self, transaction: Transaction, behavior: BehaviorProfile) -> List[RuleHit]:

        hits: List[RuleHit] = []

        context = self._build_context(transaction, behavior)

        for rule in self._rules:
            is_triggered = self._evaluator.evaluate(rule, context)
            
            if is_triggered:
                logger.info(f"Rule triggered: {rule.name}")
                hits.append({
                    "rule_id": str(rule.id),
                    "rule_name": rule.name,
                    "dsl_expression": rule.dsl_expression,
                    "severity": rule.severity.value
                })

        return hits

    def _build_context(self, tx: Transaction, beh: BehaviorProfile) -> Dict[str, Any]:

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
            
            # --- Helper / Derived Logic ---
            "is_foreign_transaction": tx.country != beh.usual_country if (tx.country and beh.usual_country) else False,
            "amount_ratio_vs_avg": (float(tx.amount) / float(beh.avg_amount_24h)) if beh.avg_amount_24h > 0 else 1.0,
            
            # If Merchant entity is populated
            "is_blacklisted_merchant": tx.merchant.is_blacklisted if getattr(tx, 'merchant', None) else False,
            "is_whitelisted_merchant": tx.merchant.is_whitelisted if getattr(tx, 'merchant', None) else False
        }