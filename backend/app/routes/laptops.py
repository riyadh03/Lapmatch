from fastapi import APIRouter
from app.utils.helpers import ok

router = APIRouter(prefix="/laptops", tags=["laptops"])


@router.get("/")
def list_laptops():
    return ok([])
