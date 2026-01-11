from fastapi import APIRouter, Query, HTTPException, Depends
from app.core.neo4j import neo4j_db
from app.auth.dependencies import get_current_user
from typing import Optional
import time

router = APIRouter(prefix="/laptops", tags=["laptops"])


@router.get("/")
def list_laptops():
    return {"success": True, "data": []}


@router.get("/search")
def search_laptops_by_name(
    search_term: str = Query(..., description="Terme de recherche (nom de la marque ou du laptop)"),
    max_distance: int = Query(3, ge=0, le=10, description="Distance maximale de Levenshtein (tolérance aux fautes de frappe)"),
    limit: int = Query(20, ge=1, le=50, description="Nombre maximum de résultats"),
    user=Depends(get_current_user)
):
    """
    Recherche de laptops par nom avec tolérance aux fautes de frappe.
    Utilise apoc.text.distance pour la distance de Levenshtein.
    """
    start_time = time.time()
    print(f"[BACKEND] 📥 Requête reçue - /laptops/search")
    print(f"[BACKEND] 📋 Paramètres: search_term='{search_term}', max_distance={max_distance}, limit={limit}")
    
    if not search_term or len(search_term.strip()) < 2:
        raise HTTPException(
            status_code=400,
            detail="Le terme de recherche doit contenir au moins 2 caractères"
        )
    
    # Nettoyer le terme de recherche
    search_term_clean = search_term.strip()
    
    # Requête Cypher avec APOC pour la distance de Levenshtein
    # Si APOC n'est pas disponible, on peut utiliser une recherche alternative
    query = """
    MATCH (l:Laptop)
    WITH l, apoc.text.distance(toLower(l.name), toLower($search_term)) AS dist
    WHERE dist < $max_distance
    RETURN l, dist
    ORDER BY dist ASC
    LIMIT $limit
    """
    
    params = {
        "search_term": search_term_clean,
        "max_distance": max_distance,
        "limit": limit
    }
    
    try:
        print(f"[BACKEND] 🔍 Exécution de la requête Neo4j avec APOC...")
        query_start = time.time()
        result = neo4j_db.execute_query(query, params)
        query_duration = time.time() - query_start
        print(f"[BACKEND] ✅ Requête Neo4j terminée en {query_duration:.2f}s - {len(result)} résultats")
        
        # Conversion des résultats
        laptops = [dict(record["l"]) for record in result]
        
        total_duration = time.time() - start_time
        print(f"[BACKEND] 🏁 Réponse envoyée en {total_duration:.2f}s total")
        
        return {
            "success": True,
            "data": laptops,
            "count": len(laptops),
            "search_term": search_term_clean
        }
        
    except Exception as e:
        error_msg = str(e)
        print(f"[BACKEND] ❌ Erreur lors de la recherche: {error_msg}")
        
        # Si APOC n'est pas disponible, essayer une recherche alternative
        if "apoc" in error_msg.lower() or "procedure" in error_msg.lower():
            print(f"[BACKEND] ⚠️ APOC non disponible, utilisation d'une recherche alternative...")
            return _search_laptops_fallback(search_term_clean, limit)
        
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la recherche: {error_msg}"
        )


def _search_laptops_fallback(search_term: str, limit: int):
    """
    Recherche alternative sans APOC : utilise CONTAINS avec toLower()
    Moins précis que la distance de Levenshtein mais fonctionne sans APOC
    """
    query = """
    MATCH (l:Laptop)
    WHERE toLower(l.name) CONTAINS toLower($search_term)
    RETURN l
    ORDER BY l.rating DESC NULLS LAST, l.price ASC
    LIMIT $limit
    """
    
    params = {
        "search_term": search_term,
        "limit": limit
    }
    
    try:
        query_start = time.time()
        result = neo4j_db.execute_query(query, params)
        query_duration = time.time() - query_start
        print(f"[BACKEND] ✅ Recherche alternative terminée en {query_duration:.2f}s - {len(result)} résultats")
        
        laptops = [dict(record["l"]) for record in result]
        
        return {
            "success": True,
            "data": laptops,
            "count": len(laptops),
            "search_term": search_term,
            "note": "Recherche sans APOC (CONTAINS uniquement)"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la recherche alternative: {str(e)}"
        )
