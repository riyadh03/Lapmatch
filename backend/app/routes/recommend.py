from fastapi import APIRouter
from app.utils.helpers import ok

router = APIRouter(prefix="/recommend", tags=["recommend"])


@router.get("/")
def recommend():
    return ok({"todo": True})
