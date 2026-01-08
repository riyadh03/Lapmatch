from fastapi import FastAPI

from app.auth.routes import router as auth_router
from app.routes.laptops import router as laptops_router
from app.routes.recommend import router as recommend_router
from app.routes.users import router as users_router

app = FastAPI(title="LapMatch API")


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(laptops_router)
app.include_router(recommend_router)
