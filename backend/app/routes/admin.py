from fastapi import APIRouter
from app.services.scraping import scrape_and_update_laptops
from app.core.neo4j import neo4j_db

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.post("/update-images")
def update_images():
    """
    Endpoint pour mettre à jour les images des laptops en base Neo4j.
    À utiliser uniquement par un administrateur.
    """
    laptops = neo4j_db.execute_query(
        "MATCH (l:Laptop) RETURN l.laptop_id AS laptop_id, l.external_link AS external_link"
    )
    laptops_list = [{"laptop_id": r["laptop_id"], "external_link": r["external_link"]} for r in laptops]

    scrape_and_update_laptops(laptops_list)
    return {"message": f"{len(laptops_list)} laptops traités, scraping terminé"}
