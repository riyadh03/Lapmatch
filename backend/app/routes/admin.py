from fastapi import APIRouter, Depends, HTTPException, status
from app.services.scraping import scrape_and_update_laptops
from app.core.neo4j import neo4j_db
from app.auth.dependencies import get_current_admin
from app.models.laptop import LaptopAdmin
import os

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.post("/laptops")
def create_or_update_laptop(
    laptop: LaptopAdmin,
    current_user: dict = Depends(get_current_admin)
):
    """
    Crée ou met à jour un laptop avec la clause MERGE
    Accessible uniquement par les Admins
    """
    query = """
    MERGE (l:Laptop {laptop_id: $laptop_id})
    SET 
        l.name = $name,
        l.price = toFloat($price),
        l.ram_gb = toInteger($ram_gb),
        l.storage_gb = toInteger($storage_gb),
        l.cpu = $cpu,
        l.gpu = $gpu,
        l.screen_size = toFloat($screen_size),
        l.weight = toFloat($weight),
        l.rating = toFloat($rating),
        l.external_link = $external_link,
        l.image_link = $image_link
    RETURN l
    """
    
    try:
        result = neo4j_db.execute_query(query, {
            "laptop_id": laptop.laptop_id,
            "name": laptop.name,
            "price": laptop.price,
            "ram_gb": laptop.ram_gb,
            "storage_gb": laptop.storage_gb,
            "cpu": laptop.cpu,
            "gpu": laptop.gpu,
            "screen_size": laptop.screen_size,
            "weight": laptop.weight,
            "rating": laptop.rating,
            "external_link": laptop.external_link,
            "image_link": laptop.image_link
        })
        return {"message": "Laptop créé/mis à jour avec succès", "laptop_id": laptop.laptop_id}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la création/mise à jour du laptop: {str(e)}"
        )

@router.delete("/laptops/{laptop_id}")
def delete_laptop(
    laptop_id: int,
    current_user: dict = Depends(get_current_admin)
):
    """
    Supprime un laptop avec DETACH DELETE pour éviter les relations orphelines
    Accessible uniquement par les Admins
    """
    query = """
    MATCH (l:Laptop {laptop_id: $laptop_id})
    DETACH DELETE l
    """
    
    try:
        result = neo4j_db.execute_query(query, {"laptop_id": laptop_id})
        return {"message": f"Laptop {laptop_id} supprimé avec succès"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la suppression du laptop: {str(e)}"
        )

@router.get("/laptops")
def get_all_laptops(current_user: dict = Depends(get_current_admin)):
    """
    Récupère tous les laptops
    Accessible uniquement par les Admins
    """
    query = """
    MATCH (l:Laptop)
    RETURN l
    ORDER BY l.laptop_id
    """
    
    try:
        result = neo4j_db.execute_query(query)
        laptops = []
        for record in result:
            laptop_data = dict(record["l"])
            laptops.append(laptop_data)
        return {"laptops": laptops, "count": len(laptops)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la récupération des laptops: {str(e)}"
        )

@router.post("/update-images")
def update_images(current_user: dict = Depends(get_current_admin)):
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
