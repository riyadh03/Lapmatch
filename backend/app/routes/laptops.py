from fastapi import APIRouter, Query, HTTPException, Depends
from app.core.neo4j import neo4j_db
from app.auth.dependencies import get_current_user
import time

router = APIRouter(prefix="/laptops", tags=["laptops"])


@router.get("/")
def list_laptops():
    return {"success": True, "data": []}


@router.get("/search")
def search_laptops_by_name(
    search_term: str = Query(..., description="Terme de recherche (nom de la marque ou du laptop)"),
    limit: int = Query(15, ge=1, le=50, description="Nombre maximum de résultats"),
    user=Depends(get_current_user)
):
    """
    Recherche de laptops par nom via un index full-text Neo4j.
    Utilise l'index full-text 'laptopNameIndex' pour une recherche rapide et floue.
    Le "~" après searchTerm active la recherche floue (fuzzy search) native de l'index.
    Sécurisé par Firebase Auth.
    """
    start_time = time.time()
    print(f"[BACKEND] 📥 Requête reçue - /laptops/search")
    print(f"[BACKEND] 📋 Paramètres: search_term='{search_term}', limit={limit}")
    
    if not search_term or len(search_term.strip()) < 2:
        raise HTTPException(
            status_code=400,
            detail="Le terme de recherche doit contenir au moins 2 caractères"
        )
    
    # Nettoyer le terme de recherche
    search_term_clean = search_term.strip()
    
    # Requête Cypher avec index full-text Neo4j
    # Le "~" après searchTerm active la recherche floue (fuzzy search)
    query = """
    CALL db.index.fulltext.queryNodes("laptopNameIndex", $search_term + "~") 
    YIELD node, score
    RETURN node AS l, score
    ORDER BY score DESC
    LIMIT $limit
    """
    
    params = {
        "search_term": search_term_clean,
        "limit": limit
    }
    
    try:
        print(f"[BACKEND] 🔍 Exécution de la requête Neo4j avec index full-text...")
        query_start = time.time()
        result = neo4j_db.execute_query(query, params)
        query_duration = time.time() - query_start
        print(f"[BACKEND] ✅ Requête Neo4j terminée en {query_duration:.2f}s - {len(result)} résultats")
        
        # Conversion des résultats : le nœud Laptop avec tous ses champs
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
        
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la recherche: {error_msg}"
        )
