from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, Any, Tuple
from ...core.entities.transaction import Transaction
from ...core.entities.behavior_profile import BehaviorProfile
from ...core.entities.alert import Alert, AlertAction
from ..interfaces.i_transaction_repository import ITransactionRepository
from ..interfaces.i_behavior_repository import IBehaviorRepository
from ..interfaces.i_rule_repository import IRuleRepository
from ..interfaces.i_alert_repository import IAlertRepository
from ..interfaces.i_model_scorer import IModelScorer
from ..services.rule_engine import RuleEngine
from ..services.decision_service import DecisionService

class ScoringUseCase:
    """
    The main use case for scoring a transaction and making a decision.
    """

    def __init__(
        self,
        transaction_repo: ITransactionRepository,
        behavior_repo: IBehaviorRepository,
        rule_repo: IRuleRepository,
        alert_repo: IAlertRepository,
        scorer: IModelScorer,
        decision_service: DecisionService
    ):
        self._transaction_repo = transaction_repo
        self._behavior_repo = behavior_repo
        self._rule_repo = rule_repo
        self._alert_repo = alert_repo
        self._scorer = scorer
        self._decision_service = decision_service

    def execute(self, transaction: Transaction) -> Tuple[AlertAction, Dict[str, Any]]:
        """
        Executes the full scoring and decision pipeline.
        """
        # 1. Get or create customer's behavior profile
        behavior = self._behavior_repo.get_by_customer_id(transaction.customer_id)
        if not behavior:
            behavior = BehaviorProfile(customer_id=transaction.customer_id)

        # 2. Compute features by comparing the transaction with the profile
        features = self._compute_features(transaction, behavior)
        
        # 3. Get all enabled rules and initialize the engine
        all_rules = self._rule_repo.get_all(only_enabled=True)
        rule_engine = RuleEngine(all_rules)
        rule_hits = rule_engine.evaluate(transaction, behavior)

        # 4. Score the transaction with the ML model
        ml_score = self._scorer.score(features)

        # 5. Make the final decision
        action, final_score = self._decision_service.decide(ml_score, rule_hits)

        # 6. If the decision is not 'APPROVE', create an alert
        if action in [AlertAction.REVIEW, AlertAction.DECLINE]:
            alert = Alert(
                transaction_id=transaction.id,
                transaction_occurred_at=transaction.occurred_at, # <-- Pasamos la fecha aquí
                action=action,
                ml_score=ml_score,
                final_score=final_score,
                rule_hits={"hits": rule_hits}
            )
            self._alert_repo.create(alert)

        # 7. Update and save the behavior profile (the "memory" update)
        updated_behavior = self._update_behavior(transaction, behavior)
        self._behavior_repo.save(updated_behavior)

        return action, {
            "ml_score": ml_score,
            "final_score": final_score,
            "rule_hits": rule_hits
        }

    def _compute_features(self, tx: Transaction, beh: BehaviorProfile) -> Dict[str, Any]:
        """Creates a feature vector for the model."""
        return {
            "amount": float(tx.amount),
            "tx_count_10m": beh.tx_count_10m,
            "tx_count_30m": beh.tx_count_30m,
            "tx_count_24h": beh.tx_count_24h,
            "avg_amount_24h": float(beh.avg_amount_24h),
            "is_new_country": beh.usual_country is not None and tx.country != beh.usual_country
        }
    
    def _update_behavior(self, tx: Transaction, beh: BehaviorProfile) -> BehaviorProfile:
        """Updates the behavior profile with the new transaction's data."""
        # This is a simplified update logic. A real system would use a more
        # robust streaming aggregation method (e.g., using TimescaleDB continuous aggregates).
        beh.tx_count_10m += 1
        beh.tx_count_30m += 1
        beh.tx_count_24h += 1
        
        # Update average amount (simplified moving average)
        current_total = beh.avg_amount_24h * Decimal(beh.tx_count_24h - 1)
        new_avg = (current_total + tx.amount) / Decimal(beh.tx_count_24h)
        beh.avg_amount_24h = new_avg

        if not beh.usual_country:
            beh.usual_country = tx.country
        
        beh.updated_at = datetime.utcnow()
        return beh