import logging
from typing import Dict, Any
from simpleeval import SimpleEval, NameNotDefined

from ...application.interfaces.i_rule_evaluator import IRuleEvaluator
from ...core.entities.rule import Rule

logger = logging.getLogger(__name__)

class SimpleEvalEvaluator(IRuleEvaluator):
    """
    Concrete Strategy: Evaluates rules using the 'simpleeval' library.
    This is safe for DSL expressions stored in the database.
    """

    def evaluate(self, rule: Rule, context: Dict[str, Any]) -> bool:
        try:
            # We create a new evaluator per rule or reuse one if needed.
            # Passing names=context allows the DSL to access variables like 'amount', 'country', etc.
            evaluator = SimpleEval(names=context)
            
            # The DSL expression must return a boolean
            is_triggered = evaluator.eval(rule.dsl_expression)
            
            return bool(is_triggered)

        except (SyntaxError, NameNotDefined, Exception) as e:
            # We log the error but do not crash the pipeline; we assume the rule did not trigger.
            logger.error(f"Strategy Error evaluating rule '{rule.name}' (ID: {rule.id}): {str(e)}")
            return False