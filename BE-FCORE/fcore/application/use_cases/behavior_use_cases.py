from uuid import UUID
from ..interfaces.i_behavior_repository import IBehaviorRepository
from ...core.errors.behavior_errors import BehaviorProfileNotFoundError
from ...core.entities.behavior_profile import BehaviorProfile

class BehaviorUseCases:
    """Use cases for interacting with customer behavior profiles."""

    def __init__(self, behavior_repository: IBehaviorRepository):
        self._behavior_repository = behavior_repository

    def get_behavior_for_customer(self, customer_id: UUID) -> BehaviorProfile:
        """
        Retrieves the behavior profile for a given customer.
        In a real scenario, it could create a default one if none exists.
        """
        profile = self._behavior_repository.get_by_customer_id(customer_id)
        if not profile:
            raise BehaviorProfileNotFoundError(f"No behavior profile found for customer {customer_id}.")
        return profile