from fastapi import APIRouter, Query, HTTPException, Depends
from app.services.recommendation import recommend_non_expert, recommend_expert
from app.auth.dependencies import get_current_user
from typing import Optional


router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)

ALLOWED_USAGES = {"GAMING", "ETUDES", "DEVELOPPEMENT", "GRAPHISME"}

# route pour user non-expert 

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
    import time
    start_time = time.time()
    print(f"[BACKEND] 📥 Requête reçue - /recommendations/non-expert")
    print(f"[BACKEND] 📋 Paramètres: usage={usage_name}, price={max_price}, rating={min_rating}, storage={storage_gb}")
    
    if usage_name not in ALLOWED_USAGES:
        raise HTTPException(
            status_code=400,
            detail=f"usage_name must be one of {ALLOWED_USAGES}"
        )

    print(f"[BACKEND] 🔍 Appel de recommend_non_expert...")
    query_start = time.time()
    laptops = recommend_non_expert(
        usage_name=usage_name,
        max_price=max_price,
        min_rating=min_rating,
        storage_gb=storage_gb,
        offset=offset,
        limit=limit
    )
    query_duration = time.time() - query_start
    print(f"[BACKEND] ✅ Requête Neo4j terminée en {query_duration:.2f}s - {len(laptops)} résultats")
    
    total_duration = time.time() - start_time
    print(f"[BACKEND] 🏁 Réponse envoyée en {total_duration:.2f}s total")
    
    return {"success": True, "data": laptops, "count": len(laptops)}

# route pour user expert 
@router.get("/expert")
def get_recommendations_expert(
    cpu_type: str = Query(..., description="CPU type, ex: i9"),
    gpu_type: str = Query(..., description="GPU type, ex: RTX3070"),
    ram_gb: int = Query(..., description="Minimum RAM in GB"),
    storage_gb: int = Query(..., description="Minimum storage in GB"),
    budget: float = Query(..., description="Budget in your currency"),
    screen_size: float = Query(..., description="Minimum screen size in inches"),
    weight: float = Query(..., description="Maximum weight in kg"),
    eco_level: Optional[str] = Query(None, description="Eco level if any"),
    offset: int = Query(0, description="Pagination offset"),
    limit: int = Query(7, description="Pagination limit")
    #user=Depends(get_current_user)   # 🔐 AJOUT ICI

):
    """
    Return a list of laptops filtered for expert users
    """
    try:
        laptops = recommend_expert(
            cpu_type=cpu_type,
            gpu_type=gpu_type,
            ram_gb=ram_gb,
            storage_gb=storage_gb,
            budget=budget,
            screen_size=screen_size,
            weight=weight,
            eco_level=eco_level,
            offset=offset,
            limit=limit
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Neo4j unavailable: {e}")
    return {"count": len(laptops), "laptops": laptops}
