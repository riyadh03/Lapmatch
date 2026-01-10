from fastapi import APIRouter
from app.core.neo4j import neo4j_db

router = APIRouter(
    prefix="/health",
    tags=["Health"]
)

@router.get("/neo4j")
def test_neo4j_connection():
    query = "MATCH (l:Laptop) RETURN count(l) AS laptop_count"
    result = neo4j_db.execute_query(query)
    return {
        "status": "Neo4j connected",
        "laptop_count": result[0]["laptop_count"]
    }
