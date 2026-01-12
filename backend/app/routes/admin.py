from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
import random
from app.services.scraping import scrape_and_update_laptops
from app.core.neo4j import neo4j_db
from app.auth.dependencies import get_current_admin
from app.models.laptop import LaptopAdmin
import os

from app.services.user_service import (
    create_user,
    delete_user_by_uid,
    get_user_by_uid,
    list_users,
    update_user_by_uid,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


class LaptopAdminUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    ram_gb: Optional[int] = None
    storage_gb: Optional[int] = None
    cpu: Optional[str] = None
    gpu: Optional[str] = None
    screen_size: Optional[float] = None
    weight: Optional[float] = None
    rating: Optional[float] = None
    stock: Optional[int] = None
    revenue: Optional[float] = None


class AdminUserCreateRequest(BaseModel):
    uid: str
    email: str
    user_type: str = "User"
    full_name: Optional[str] = None
    total_spent: Optional[float] = None


class AdminUserUpdateRequest(BaseModel):
    email: Optional[str] = None
    user_type: Optional[str] = None
    full_name: Optional[str] = None
    total_spent: Optional[float] = None

@router.post("/laptops")
def create_or_update_laptop(
    laptop: LaptopAdmin,
    current_user: dict = Depends(get_current_admin)
):
    """
    Crée ou met à jour un laptop avec la clause MERGE
    Accessible uniquement par les Admins
    """
    stock = random.randint(0, 20)
    revenue = float(random.randint(0, 1000))

    query = """
    MERGE (l:Laptop {laptop_id: $laptop_id})
    ON CREATE SET
        l.stock = toInteger($stock),
        l.revenue = toFloat($revenue),
        l.external_link = $external_link,
        l.image_link = $image_link
    SET
        l.name = $name,
        l.price = toFloat($price),
        l.ram_gb = toInteger($ram_gb),
        l.storage_gb = toInteger($storage_gb),
        l.cpu = $cpu,
        l.gpu = $gpu,
        l.screen_size = toFloat($screen_size),
        l.weight = toFloat($weight),
        l.rating = toFloat($rating)
    RETURN l
    """
    
    try:
        neo4j_db.execute_query(query, {
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
            "image_link": laptop.image_link,
            "stock": stock,
            "revenue": revenue,
        })
        return {"message": "Laptop créé/mis à jour avec succès", "laptop_id": laptop.laptop_id}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la création/mise à jour du laptop: {str(e)}"
        )


@router.patch("/laptops/{laptop_id}")
def update_laptop(
    laptop_id: int,
    payload: LaptopAdminUpdate,
    current_user: dict = Depends(get_current_admin)
):
    if payload.model_dump(exclude_unset=True) == {}:
        raise HTTPException(status_code=400, detail="Aucun champ à mettre à jour")

    query = """
    MATCH (l:Laptop {laptop_id: $laptop_id})
    SET
        l.name = coalesce($name, l.name),
        l.price = coalesce(toFloat($price), l.price),
        l.ram_gb = coalesce(toInteger($ram_gb), l.ram_gb),
        l.storage_gb = coalesce(toInteger($storage_gb), l.storage_gb),
        l.cpu = coalesce($cpu, l.cpu),
        l.gpu = coalesce($gpu, l.gpu),
        l.screen_size = coalesce(toFloat($screen_size), l.screen_size),
        l.weight = coalesce(toFloat($weight), l.weight),
        l.rating = coalesce(toFloat($rating), l.rating),
        l.stock = coalesce(toInteger($stock), l.stock),
        l.revenue = coalesce(toFloat($revenue), l.revenue)
    RETURN l
    """

    params = {"laptop_id": laptop_id, **payload.model_dump(exclude_unset=True)}

    try:
        result = neo4j_db.execute_query(query, params)
        if not result:
            raise HTTPException(status_code=404, detail="Laptop non trouvé")
        return {"laptop": dict(result[0]["l"])}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la mise à jour du laptop: {str(e)}"
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


@router.get("/laptops/summary")
def get_laptops_summary(current_user: dict = Depends(get_current_admin)):
    query = """
    MATCH (l:Laptop)
    RETURN count(l) AS total_products, sum(coalesce(l.revenue, 0)) AS revenue
    """

    try:
        result = neo4j_db.execute_query(query)
        if not result:
            return {"total_products": 0, "revenue": 0}
        row = result[0]
        return {
            "total_products": int(row["total_products"] or 0),
            "revenue": float(row["revenue"] or 0),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la récupération du résumé: {str(e)}"
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


@router.get("/users")
def admin_list_users(current_user: dict = Depends(get_current_admin)):
    try:
        users = list_users()
        return {"users": users, "count": len(users)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la récupération des users: {str(e)}"
        )


@router.get("/users/{uid}")
def admin_get_user(uid: str, current_user: dict = Depends(get_current_admin)):
    user = get_user_by_uid(uid)
    if not user:
        raise HTTPException(status_code=404, detail="User non trouvé")
    return {"user": dict(user)}


@router.post("/users")
def admin_create_user(payload: AdminUserCreateRequest, current_user: dict = Depends(get_current_admin)):
    try:
        node = create_user(
            payload.uid,
            payload.email,
            user_type=payload.user_type,
            full_name=payload.full_name,
            total_spent=payload.total_spent,
        )
        return {"message": "User créé/mis à jour", "user": dict(node)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la création du user: {str(e)}"
        )


@router.patch("/users/{uid}")
def admin_update_user(uid: str, payload: AdminUserUpdateRequest, current_user: dict = Depends(get_current_admin)):
    if payload.model_dump(exclude_unset=True) == {}:
        raise HTTPException(status_code=400, detail="Aucun champ à mettre à jour")

    try:
        updated = update_user_by_uid(uid, **payload.model_dump(exclude_unset=True))
        if not updated:
            raise HTTPException(status_code=404, detail="User non trouvé")
        return {"user": dict(updated)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la mise à jour du user: {str(e)}"
        )


@router.delete("/users/{uid}")
def admin_delete_user(uid: str, current_user: dict = Depends(get_current_admin)):
    try:
        deleted = delete_user_by_uid(uid)
        if not deleted:
            raise HTTPException(status_code=404, detail="User non trouvé")
        return {"message": f"User {uid} supprimé"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la suppression du user: {str(e)}"
        )
