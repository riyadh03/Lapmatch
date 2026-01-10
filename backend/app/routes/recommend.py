from fastapi import APIRouter, Query, HTTPException, Depends
from app.services.recommendation import recommend_non_expert
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)

ALLOWED_USAGES = {"GAMING", "ETUDES", "DEVELOPPEMENT", "GRAPHISME"}

@router.get("/non-expert")
def get_non_expert_recommendations(
    usage_name: str = Query(...),
    max_price: float = Query(..., gt=0),
    min_rating: float = Query(0, ge=0, le=5),
    storage_gb: int = Query(0, ge=0),
    offset: int = Query(0, ge=0),
    limit: int = Query(7, ge=1, le=20),
    user=Depends(get_current_user)   # 🔐 AJOUT ICI
):
    if usage_name not in ALLOWED_USAGES:
        raise HTTPException(
            status_code=400,
            detail=f"usage_name must be one of {ALLOWED_USAGES}"
        )

    return recommend_non_expert(
        usage_name=usage_name,
        max_price=max_price,
        min_rating=min_rating,
        storage_gb=storage_gb,
        offset=offset,
        limit=limit
    )
