from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.openapi.models import SecurityScheme
from fastapi.openapi.utils import get_openapi

from fcore.presentation.api.controllers import (analyst_controller, auth_controller, 
                                                role_controller, customer_controller, merchant_controller,
                                                transaction_controller, behavior_controller, rule_controller,
                                                alert_controller, case_controller, scoring_controller)
from fcore.core.errors.analyst_errors import AnalystNotFoundError, AnalystAlreadyExistsError
from fcore.core.errors.customer_errors import CustomerNotFoundError, CustomerAlreadyExistsError
from fcore.core.errors.merchant_errors import MerchantNotFoundError, MerchantAlreadyExistsError
from fcore.core.errors.transaction_errors import TransactionNotFoundError
from fcore.core.errors.behavior_errors import BehaviorProfileNotFoundError
from fcore.core.errors.roles_errors import RoleNotFoundError
from fcore.core.errors.rule_errors import RuleNotFoundError, RuleAlreadyExistsError
from fcore.core.errors.alert_errors import AlertNotFoundError
from fcore.core.errors.case_errors import CaseNotFoundError, CaseAlreadyExistsError

app = FastAPI(title="Fraud Detection System API")

# --- Custom Exception Handlers ---
@app.exception_handler(AnalystNotFoundError)
async def analyst_not_found_exception_handler(request: Request, exc: AnalystNotFoundError):
    return JSONResponse(status_code=404, content={"message": str(exc)})

@app.exception_handler(AnalystAlreadyExistsError)
async def analyst_already_exists_exception_handler(request: Request, exc: AnalystAlreadyExistsError):
    return JSONResponse(status_code=409, content={"message": str(exc)})

@app.exception_handler(RoleNotFoundError)
async def rol_not_found_exception_handler(request: Request, exc: RoleNotFoundError):
    return JSONResponse(status_code=404, content={"message": str(exc)})

@app.exception_handler(CustomerNotFoundError)
async def customer_not_found_exception_handler(request: Request, exc: CustomerNotFoundError):
    return JSONResponse(status_code=404, content={"message": str(exc)})

@app.exception_handler(CustomerAlreadyExistsError)
async def customer_already_exists_exception_handler(request: Request, exc: CustomerAlreadyExistsError):
    return JSONResponse(status_code=409, content={"message": str(exc)})

@app.exception_handler(MerchantNotFoundError)
async def merchant_not_found_exception_handler(request: Request, exc: MerchantNotFoundError):
    return JSONResponse(status_code=404, content={"message": str(exc)})

@app.exception_handler(MerchantAlreadyExistsError)
async def merchant_already_exists_exception_handler(request: Request, exc: MerchantAlreadyExistsError):
    return JSONResponse(status_code=409, content={"message": str(exc)})

@app.exception_handler(TransactionNotFoundError)
async def transaction_not_found_exception_handler(request: Request, exc: TransactionNotFoundError):
    return JSONResponse(status_code=404, content={"message": str(exc)})

@app.exception_handler(BehaviorProfileNotFoundError)
async def behavior_profile_not_found_exception_handler(request: Request, exc: BehaviorProfileNotFoundError):
    return JSONResponse(status_code=404, content={"message": str(exc)})

@app.exception_handler(RuleNotFoundError)
async def rule_not_found_exception_handler(request: Request, exc: RuleNotFoundError):
    return JSONResponse(status_code=404, content={"message": str(exc)})

@app.exception_handler(RuleAlreadyExistsError)
async def rule_already_exists_exception_handler(request: Request, exc: RuleAlreadyExistsError):
    return JSONResponse(status_code=409, content={"message": str(exc)})

@app.exception_handler(AlertNotFoundError)
async def alert_not_found_exception_handler(request: Request, exc: AlertNotFoundError):
    return JSONResponse(status_code=404, content={"message": str(exc)})

@app.exception_handler(CaseNotFoundError)
async def case_not_found_exception_handler(request: Request, exc: CaseNotFoundError):
    return JSONResponse(status_code=404, content={"message": str(exc)})

@app.exception_handler(CaseAlreadyExistsError)
async def case_already_exists_exception_handler(request: Request, exc: CaseAlreadyExistsError):
    return JSONResponse(status_code=409, content={"message": str(exc)})

# --- Include Routers ---
app.include_router(auth_controller.router, tags=["Authentication"])
app.include_router(analyst_controller.router)
app.include_router(role_controller.router)
app.include_router(customer_controller.router)
app.include_router(merchant_controller.router)
app.include_router(transaction_controller.router)
app.include_router(behavior_controller.router)
app.include_router(rule_controller.router)
app.include_router(alert_controller.router)
app.include_router(case_controller.router)
app.include_router(scoring_controller.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Fraud Detection API"}

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT in the format: Bearer &lt;token&gt;"
        }
    }
    
    # Apply the security scheme to all routes that are not tagged with "Authentication"
    for path in openapi_schema["paths"].values():
        for method in path.values():
            if "Authentication" not in method.get("tags", []):
                method["security"] = [{"BearerAuth": []}]
                
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi