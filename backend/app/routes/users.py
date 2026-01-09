from fastapi import APIRouter
from app.utils.helpers import ok

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
def me():
    return ok({"todo": True})
