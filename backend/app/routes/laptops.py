from fastapi import APIRouter

router = APIRouter(prefix="/laptops", tags=["laptops"])


@router.get("")
def list_laptops():
    return []
