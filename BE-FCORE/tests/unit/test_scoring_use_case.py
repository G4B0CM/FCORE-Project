import pytest
from unittest.mock import Mock, MagicMock, ANY
from fcore.application.use_cases.scoring_use_case import ScoringUseCase
from fcore.core.entities.alert import AlertAction

@pytest.fixture
def mocks():
    return {
        "tx_repo": Mock(),
        "beh_repo": Mock(),
        "rule_repo": Mock(),
        "alert_repo": Mock(),
        "case_repo": Mock(),
        "analyst_repo": Mock(),
        "scorer": Mock(),
        "decision_service": Mock()
    }

@pytest.fixture
def scoring_use_case(mocks):
    return ScoringUseCase(
        mocks["tx_repo"], mocks["beh_repo"], mocks["rule_repo"],
        mocks["alert_repo"], mocks["case_repo"], mocks["analyst_repo"],
        mocks["scorer"], mocks["decision_service"]
    )

def test_scoring_flow_high_risk(scoring_use_case, mocks):
    """
    Cubre:
    HU-01 (Evaluar transacción con reglas)
    HU-03 (Servicio de decisión)
    HU-04 (Generar Alerta)
    HU-07 (Crear Caso automático para analista)
    """
    # Arrange
    tx = MagicMock()
    tx.id = "tx-123"
    tx.customer_id = "cust-1"
    tx.amount = 500.00
    
    # Comportamiento del cliente
    beh_profile = MagicMock()
    mocks["beh_repo"].get_by_customer_id.return_value = beh_profile
    mocks["beh_repo"].calculate_features_from_history.return_value = {
        "tx_count_10m": 5, "tx_count_30m": 10, "tx_count_24h": 20, "avg_amount_24h": 50.0, "usual_country": "EC"
    }

    # Reglas habilitadas
    rule1 = MagicMock()
    rule1.dsl_expression = "amount > 1000" # Simplificado para mock
    mocks["rule_repo"].get_all.return_value = [rule1]

    # Modelo ML
    mocks["scorer"].score.return_value = 0.95 # High risk score

    # Decision Service dice DECLINE
    mocks["decision_service"].decide.return_value = (AlertAction.DECLINE, 0.95)

    # Alert Repo devuelve la alerta creada
    created_alert = MagicMock()
    created_alert.id = "alert-999"
    mocks["alert_repo"].create.return_value = created_alert

    # Hay analistas disponibles para asignar el caso
    analyst = MagicMock()
    analyst.id = "analyst-1"
    mocks["analyst_repo"].get_all.return_value = [analyst]

    # Act
    action, details = scoring_use_case.execute(tx)

    # Assert
    assert action == AlertAction.DECLINE
    assert details["ml_score"] == 0.95
    
    # Verificar que se calcularon features (HU-01)
    mocks["scorer"].score.assert_called()
    
    # Verificar creación de Alerta (HU-04)
    mocks["alert_repo"].create.assert_called_once()
    
    # Verificar creación de Caso (HU-07 implícita en flujo)
    mocks["case_repo"].create.assert_called_once()
    
    # Verificar actualización de comportamiento (HU-09)
    mocks["beh_repo"].save.assert_called_once()