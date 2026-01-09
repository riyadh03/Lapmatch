from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.auth.routes import router as auth_router
from app.routes.laptops import router as laptops_router
from app.routes.recommend import router as recommend_router
from app.routes.users import router as users_router

app = FastAPI(title="LapMatch API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"success": True, "data": {"status": "ok"}}

@app.exception_handler(HTTPException)
async def http_exception_handler(_request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": {"message": exc.detail}},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {"message": "Validation Error", "details": exc.errors()},
        },
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(_request: Request, _exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": {"message": "Internal Server Error"}},
    )

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(laptops_router)
app.include_router(recommend_router)
