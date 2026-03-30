from datetime import datetime
from typing import Dict, Any, Tuple
import logging
import random

from ...core.entities.transaction import Transaction
from ...core.entities.behavior_profile import BehaviorProfile
from ...core.entities.alert import Alert, AlertAction
from ...core.entities.case import Case

from ..interfaces.i_transaction_repository import ITransactionRepository
from ..interfaces.i_behavior_repository import IBehaviorRepository
from ..interfaces.i_rule_repository import IRuleRepository
from ..interfaces.i_alert_repository import IAlertRepository
from ..interfaces.i_case_repository import ICaseRepository
from ..interfaces.i_analyst_repository import IAnalystRepository
from ..interfaces.i_model_scorer import IModelScorer
from ..interfaces.i_rule_evaluator import IRuleEvaluator  # <--- New Import

from ..services.rule_engine import RuleEngine
from ..services.decision_service import DecisionService

logger = logging.getLogger(__name__)

class ScoringUseCase:
    """
    The main use case for scoring a transaction.
    """

    def __init__(
        self,
        transaction_repo: ITransactionRepository,
        behavior_repo: IBehaviorRepository,
        rule_repo: IRuleRepository,
        alert_repo: IAlertRepository,
        case_repo: ICaseRepository,
        analyst_repo: IAnalystRepository,
        scorer: IModelScorer,
        decision_service: DecisionService,
        rule_evaluator: IRuleEvaluator # <--- Injected Strategy
    ):
        self._transaction_repo = transaction_repo
        self._behavior_repo = behavior_repo
        self._rule_repo = rule_repo
        self._alert_repo = alert_repo
        self._case_repo = case_repo
        self._analyst_repo = analyst_repo
        self._scorer = scorer
        self._decision_service = decision_service
        self._rule_evaluator = rule_evaluator # <--- Saved Strategy

    def execute(self, transaction: Transaction) -> Tuple[AlertAction, Dict[str, Any]]:
        # 1. Get or create customer's behavior profile
        behavior = self._behavior_repo.get_by_customer_id(transaction.customer_id)
        if not behavior:
            behavior = BehaviorProfile(customer_id=transaction.customer_id)

        # 2. Compute features
        features = self._compute_features(transaction, behavior)
        
        # 3. Get all enabled rules and initialize the engine with the Strategy
        all_rules = self._rule_repo.get_all(only_enabled=True)
        
        # INJECTION: We pass the strategy (evaluator) to the engine
        rule_engine = RuleEngine(rules=all_rules, evaluator=self._rule_evaluator)
        
        rule_hits = rule_engine.evaluate(transaction, behavior)

        # 4. Score the transaction with the ML model
        ml_score = self._scorer.score(features)

        # 5. Make the final decision
        action, final_score = self._decision_service.decide(ml_score, rule_hits)

        # 6. Alert Logic (Refactored slightly for brevity, logic remains same)
        if action in [AlertAction.REVIEW, AlertAction.DECLINE]:
            self._handle_alert_creation(transaction, action, ml_score, final_score, rule_hits)

        # 7. Update and save behavior
        updated_behavior = self._update_behavior_from_db(transaction, behavior)
        self._behavior_repo.save(updated_behavior)

        return action, {
            "ml_score": ml_score,
            "final_score": final_score,
            "rule_hits": rule_hits
        }

    def _handle_alert_creation(self, tx, action, ml_score, final_score, rule_hits):
        """Helper to keep execute clean"""
        alert = Alert(
            transaction_id=tx.id,
            transaction_occurred_at=tx.occurred_at,
            action=action,
            ml_score=ml_score,
            final_score=final_score,
            rule_hits={"hits": rule_hits}
        )
        alert_created = self._alert_repo.create(alert)
        
        analysts = self._analyst_repo.get_all()
        if analysts:
            analyst = random.choice(analysts)
            case = Case(alert_id=alert_created.id, analyst_id=analyst.id)
            self._case_repo.create(case)
            logger.info(f"Case created for Alert {alert_created.id}. Assigned to {analyst.name}")
        else:
            logger.warning(f"Alert {alert_created.id} created but NO ANALYSTS available.")

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
    
    def _update_behavior_from_db(self, tx: Transaction, beh: BehaviorProfile) -> BehaviorProfile:
        stats = self._behavior_repo.calculate_features_from_history(tx.customer_id)
        beh.tx_count_10m = stats["tx_count_10m"]
        beh.tx_count_30m = stats["tx_count_30m"]
        beh.tx_count_24h = stats["tx_count_24h"]
        beh.avg_amount_24h = stats["avg_amount_24h"]
        
        if stats["usual_country"]:
            beh.usual_country = stats["usual_country"]
        elif not beh.usual_country:
            beh.usual_country = tx.country

        beh.updated_at = datetime.utcnow()
        return beh
