from fastapi import APIRouter, HTTPException
from app.core.neo4j import neo4j_db

router = APIRouter(
    prefix="/health",
    tags=["Health"]
)

@router.get("/neo4j")
def test_neo4j_connection():
    query = "MATCH (l:Laptop) RETURN count(l) AS laptop_count"
    try:
        result = neo4j_db.execute_query(query)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Neo4j unavailable: {e}")
    return {
        "status": "Neo4j connected",
        "laptop_count": result[0]["laptop_count"]
    }
