from app.core.neo4j import neo4j_db


def get_similar_laptops(laptop_id: int, limit: int = 5):
    """
    Récupère les laptops similaires à un laptop donné.
    Utilise la relation SIMILAR_TO avec le similarity_score calculé.
    
    Args:
        laptop_id: ID du laptop pour lequel on cherche des similaires
        limit: Nombre maximum de laptops similaires à retourner (défaut: 5)
    
    Returns:
        Liste de dictionnaires représentant les laptops similaires, 
        triés par similarity_score décroissant
    """
    import time
    query_start = time.time()
    print(f"[SIMILARITY] 🔍 Recherche de laptops similaires pour laptop_id={laptop_id}")
    
    # Requête Cypher : trouve les laptops liés par SIMILAR_TO
    # et trie par similarity_score décroissant pour avoir les plus pertinents en premier
    query = """
    MATCH (l:Laptop {laptop_id: $laptop_id})-[r:SIMILAR_TO]-(similar:Laptop)
    RETURN similar AS l, r.similarity_score AS similarity_score
    ORDER BY similarity_score DESC
    LIMIT $limit
    """
    
    params = {
        "laptop_id": laptop_id,
        "limit": limit
    }
    
    try:
        print(f"[SIMILARITY] ⏳ Exécution de la requête Neo4j...")
        exec_start = time.time()
        result = neo4j_db.execute_query(query, params)
        exec_duration = time.time() - exec_start
        print(f"[SIMILARITY] ✅ Requête exécutée en {exec_duration:.2f}s - {len(result)} résultats")
        
        # Conversion Neo4j → dict JSON
        print(f"[SIMILARITY] 🔄 Conversion des résultats...")
        convert_start = time.time()
        laptops = [dict(record["l"]) for record in result]
        convert_duration = time.time() - convert_start
        print(f"[SIMILARITY] ✅ Conversion terminée en {convert_duration:.2f}s - {len(laptops)} laptops")
        
        total_duration = time.time() - query_start
        print(f"[SIMILARITY] 🏁 Total: {total_duration:.2f}s")
        
        return laptops
        
    except Exception as e:
        print(f"[SIMILARITY] ❌ Erreur lors de la récupération des laptops similaires: {e}")
        raise
