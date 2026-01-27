import os
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ...infrastructure.database.models.base_db_model import Base
from ...infrastructure.database.repositories.sqlalchemy_analyst_repository import SqlAlchemyAnalystRepository
from ...infrastructure.database.repositories.sqlalchemy_role_repository import SqlAlchemyRoleRepository
from ...infrastructure.security.bcrypt_password_hasher import BcryptPasswordHasher
from ...infrastructure.security.jwt_token_service import JwtTokenService
from ...infrastructure.database.repositories.sqlalchemy_customer_repository import SqlAlchemyCustomerRepository
from ...infrastructure.database.repositories.sqlalchemy_merchant_repository import SqlAlchemyMerchantRepository
from ...infrastructure.database.repositories.sqlalchemy_transaction_repository import SqlAlchemyTransactionRepository
from ...infrastructure.database.repositories.sqlalchemy_behavior_repository import SqlAlchemyBehaviorRepository
from ...infrastructure.database.repositories.sqlalchemy_rule_repository import SqlAlchemyRuleRepository
from ...infrastructure.database.repositories.sqlalchemy_alert_repository import SqlAlchemyAlertRepository
from ...infrastructure.database.repositories.sqlalchemy_case_repository import SqlAlchemyCaseRepository
from ...infrastructure.strategies.simple_eval_evaluator import SimpleEvalEvaluator
from ...infrastructure.ml.xgb_scorer import XgbScorerStub

from ...application.services.decision_service import DecisionService
from ...application.use_cases.scoring_use_case import ScoringUseCase
from ...application.use_cases.case_use_cases import CaseUseCases
from ...application.use_cases.alert_use_cases import AlertUseCases
from ...application.use_cases.crud_rule_use_case import CrudRuleUseCase
from ...application.use_cases.behavior_use_case import BehaviorUseCases
from ...application.use_cases.transaction_use_case import TransactionUseCases
from ...application.use_cases.crud_merchant_use_case import CrudMerchantUseCase
from ...application.use_cases.crud_customer_use_case import CrudCustomerUseCase
from ...application.interfaces.i_analyst_repository import IAnalystRepository
from ...application.interfaces.i_case_repository import ICaseRepository
from ...application.interfaces.i_model_scorer import IModelScorer
from ...application.interfaces.i_rule_repository import IRuleRepository
from ...application.interfaces.i_behavior_repository import IBehaviorRepository
from ...application.interfaces.i_alert_repository import IAlertRepository
from ...application.interfaces.i_transaction_repository import ITransactionRepository
from ...application.interfaces.i_password_hasher import IPasswordHasher
from ...application.interfaces.i_token_provider import ITokenProvider
from ...application.interfaces.i_rule_evaluator import IRuleEvaluator
from ...application.use_cases.auth_use_case import AuthUseCase
from ...application.use_cases.crud_analyst_use_case import CrudAnalystUseCase
from ...application.use_cases.crud_role_use_case import CrudRoleUseCase
from ...core.entities.analyst import Analyst
from .schemas.token_schemas import TokenData, TokenPayload

load_dotenv()

# --- Database Setup ---
DB_USER = os.getenv("POSTGRES_USER", "fcore_user")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "fcore_password")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "fcore_db")

# Cadena de conexión para PostgreSQL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    finally:
        db.close()

# --- Security & Auth Dependencies ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_password_hasher():
    return BcryptPasswordHasher()

def get_token_service() -> ITokenProvider:
    return JwtTokenService()

# --- Repository Dependencies ---
def get_analyst_repo(db: Session = Depends(get_db)):
    return SqlAlchemyAnalystRepository(db)

def get_role_repo(db: Session = Depends(get_db)):
    return SqlAlchemyRoleRepository(db)

def get_customer_repo(db: Session = Depends(get_db)):
    return SqlAlchemyCustomerRepository(db)

def get_merchant_repo(db: Session = Depends(get_db)):
    return SqlAlchemyMerchantRepository(db)

def get_transaction_repo(db: Session = Depends(get_db)):
    return SqlAlchemyTransactionRepository(db)

def get_behavior_repo(db: Session = Depends(get_db)):
    return SqlAlchemyBehaviorRepository(db)

def get_rule_repo(db: Session = Depends(get_db)):
    return SqlAlchemyRuleRepository(db)

def get_alert_repo(db: Session = Depends(get_db)):
    return SqlAlchemyAlertRepository(db)

def get_case_repo(db: Session = Depends(get_db)):
    return SqlAlchemyCaseRepository(db)

# --- Service Dependencies ---
def get_model_scorer() -> IModelScorer:
    return XgbScorerStub()

def get_decision_service() -> DecisionService:
    return DecisionService()

def get_rule_evaluator() -> IRuleEvaluator:
    return SimpleEvalEvaluator()

# --- Use Case Dependencies ---
def get_analyst_crud_use_case(
    repo: SqlAlchemyAnalystRepository = Depends(get_analyst_repo),
    role_repo: SqlAlchemyRoleRepository = Depends(get_role_repo),
    hasher: BcryptPasswordHasher = Depends(get_password_hasher)
):
    return CrudAnalystUseCase(analyst_repository=repo, role_repository=role_repo, password_service=hasher)

def get_role_crud_use_case(repo: SqlAlchemyRoleRepository = Depends(get_role_repo)):
    return CrudRoleUseCase(role_repository=repo)

def get_auth_use_case(
    repo: IAnalystRepository = Depends(get_analyst_repo),
    hasher: IPasswordHasher = Depends(get_password_hasher),
    token_service: ITokenProvider = Depends(get_token_service)
):
    return AuthUseCase(analyst_repo=repo, password_hasher=hasher, token_service=token_service)

def get_customer_crud_use_case(repo: SqlAlchemyCustomerRepository = Depends(get_customer_repo)):
    return CrudCustomerUseCase(customer_repository=repo)

def get_merchant_crud_use_case(repo: SqlAlchemyMerchantRepository = Depends(get_merchant_repo)):
    return CrudMerchantUseCase(merchant_repository=repo)

def get_transaction_use_cases(
    transaction_repo: SqlAlchemyTransactionRepository = Depends(get_transaction_repo),
    customer_repo: SqlAlchemyCustomerRepository = Depends(get_customer_repo),
    merchant_repo: SqlAlchemyMerchantRepository = Depends(get_merchant_repo)
):
    return TransactionUseCases(
        transaction_repository=transaction_repo,
        customer_repository=customer_repo,
        merchant_repository=merchant_repo
    )
    
def get_behavior_use_cases(repo: SqlAlchemyBehaviorRepository = Depends(get_behavior_repo)):
    return BehaviorUseCases(behavior_repository=repo)

def get_rule_crud_use_case(repo: SqlAlchemyRuleRepository = Depends(get_rule_repo)):
    return CrudRuleUseCase(rule_repository=repo)

def get_alert_use_cases(repo: SqlAlchemyAlertRepository = Depends(get_alert_repo)):
    return AlertUseCases(alert_repository=repo)

def get_case_use_cases(
    case_repo: SqlAlchemyCaseRepository = Depends(get_case_repo),
    alert_repo: IAlertRepository = Depends(get_alert_repo) # Inject alert repo
):
    return CaseUseCases(case_repository=case_repo, alert_repository=alert_repo)

def get_scoring_use_case(
    transaction_repo: ITransactionRepository = Depends(get_transaction_repo),
    behavior_repo: IBehaviorRepository = Depends(get_behavior_repo),
    rule_repo: IRuleRepository = Depends(get_rule_repo),
    evaluator: IRuleEvaluator = Depends(get_rule_evaluator),
    alert_repo: IAlertRepository = Depends(get_alert_repo),
    case_repo: ICaseRepository = Depends(get_case_repo),
    analyst_repo: IAnalystRepository = Depends(get_analyst_repo),
    scorer: IModelScorer = Depends(get_model_scorer),
    decision_service: DecisionService = Depends(get_decision_service)
):
    return ScoringUseCase(
        transaction_repo=transaction_repo,
        behavior_repo=behavior_repo,
        rule_repo=rule_repo,
        rule_evaluator=evaluator,
        alert_repo=alert_repo,
        case_repo=case_repo,
        analyst_repo=analyst_repo,
        scorer=scorer,
        decision_service=decision_service
    )

# --- Obtaining current user logic ---

async def get_current_analyst(
    token: str = Depends(oauth2_scheme),
    token_service: ITokenProvider = Depends(get_token_service)
) -> TokenPayload:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = token_service.decode_access_token(token)
        if token_service.is_token_invalidated(payload.jti):
            raise credentials_exception
        return payload
    except ValueError:
        raise credentials_exception

async def get_current_active_analyst_entity(
    payload: TokenPayload = Depends(get_current_analyst),
    analyst_repo: IAnalystRepository = Depends(get_analyst_repo)
) -> Analyst:
    analyst = analyst_repo.find_by_code(code=payload.sub)
    if analyst is None or not analyst.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    return analyst

async def is_admin(current_analyst: Analyst = Depends(get_current_active_analyst_entity)):
    if current_analyst.role.name.lower() != 'admin':
        raise HTTPException(status_code=403, detail="Operation not permitted")