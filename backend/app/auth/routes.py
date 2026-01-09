from fastapi import APIRouter
from app.utils.helpers import ok

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/verify")
def verify():
    return ok({"verified": False})
