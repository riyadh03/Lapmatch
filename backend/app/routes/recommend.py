from fastapi import APIRouter

router = APIRouter(prefix="/recommend", tags=["recommend"])


@router.get("")
def recommend():
    return {"todo": True}
