"fastapi app"
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, APIRouter
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from router.auth import auth_router
from router.mypage import mypage_router
from router.product import product_router
from router.order import order_router


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3001",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://fastapi:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

main_router = APIRouter()


@main_router.get("/health-check")
def healthcheck():
    return "200"


app.include_router(main_router)
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(mypage_router, prefix="/api/mypage", tags=["mypage"])
app.include_router(product_router, prefix="/api/product", tags=["product"])
app.include_router(order_router, prefix="/api/order", tags=["order"])


# 422 error handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """422 error handler"""
    print(exc.errors())
    print(request.headers)
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )


from uvicorn.config import LOGGING_CONFIG
import uvicorn

if __name__ == "__main__":
    LOGGING_CONFIG["formatters"]["access"][
        "fmt"
    ] = '%(levelprefix)s %(asctime)s - %(client_addr)s - "%(request_line)s" %(status_code)s'
    uvicorn.run("main:app", port=8000, reload=True, host="0.0.0.0")
