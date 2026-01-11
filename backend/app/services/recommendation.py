from app.core.neo4j import neo4j_db

def recommend_non_expert(
    usage_name: str,
    max_price: float,
    min_rating: float,
    storage_gb: int,
    offset: int = 0,
    limit: int = 7
):
    import time
    query_start = time.time()
    print(f"[NEO4J] 🔍 Début de la requête Neo4j")
    print(f"[NEO4J] 📋 Paramètres: usage={usage_name}, price={max_price}, rating={min_rating}, storage={storage_gb}")
    
    query = """
    MATCH (l:Laptop)-[:SUITABLE_FOR]->(u:Usage {usage_name: $usage_name})
    WHERE 
        l.price >= ($max_price * 0.85)
        AND l.price <= ($max_price * 1.15)
        AND (l.rating IS NULL OR l.rating >= $min_rating)
        AND l.storage_gb >= $storage_gb
    RETURN l
    ORDER BY 
        CASE WHEN l.rating IS NULL THEN 0 ELSE l.rating END DESC,
        l.price ASC
    SKIP $offset
    LIMIT $limit
    """

    params = {
        "usage_name": usage_name,
        "max_price": max_price,
        "min_rating": min_rating,
        "storage_gb": storage_gb,
        "offset": offset,
        "limit": limit
    }

    print(f"[NEO4J] ⏳ Exécution de la requête Cypher...")
    exec_start = time.time()
    result = neo4j_db.execute_query(query, params)
    exec_duration = time.time() - exec_start
    print(f"[NEO4J] ⏱️ Requête exécutée en {exec_duration:.2f}s")

    # Conversion Neo4j → dict JSON
    print(f"[NEO4J] 🔄 Conversion des résultats...")
    convert_start = time.time()
    laptops = [dict(record["l"]) for record in result]
    convert_duration = time.time() - convert_start
    print(f"[NEO4J] ✅ Conversion terminée en {convert_duration:.2f}s - {len(laptops)} laptops")
    
    total_duration = time.time() - query_start
    print(f"[NEO4J] 🏁 Total: {total_duration:.2f}s")
    
    return laptops


def recommend_expert(
    cpu_type: str,
    gpu_type: str,
    ram_gb: int,
    storage_gb: int,
    budget: float,
    screen_size: float,
    weight: float,
    eco_level: str | None = None,
    offset: int = 0,
    limit: int = 7
):
    query = """
    MATCH (l:Laptop)-[:HAS_COMPONENT]->(cpu:Component {type: "CPU"})
    MATCH (l)-[:HAS_COMPONENT]->(gpu:Component {type: "GPU"})
    OPTIONAL MATCH (l)-[:HAS_ECO_CLASS]->(eco:Eco_Class)

    WHERE
        toLower(cpu.name) CONTAINS toLower($cpu_type)
        AND toLower(gpu.name) CONTAINS toLower($gpu_type)
        AND l.ram_gb >= $ram_gb
        AND l.storage_gb >= $storage_gb
        AND l.price >= ($budget * 0.85) AND l.price <= ($budget * 1.15)
        AND l.screen_size >= $screen_size AND l.screen_size <= ($screen_size + 2)
        AND l.weight <= $weight
        AND ($eco_level IS NULL OR eco.level = $eco_level)

    RETURN l
    ORDER BY l.ram_gb DESC, l.price ASC
    SKIP $offset
    LIMIT $limit
    """

    params = {
        "cpu_type": cpu_type,
        "gpu_type": gpu_type,
        "ram_gb": ram_gb,
        "storage_gb": storage_gb,
        "budget": budget,
        "screen_size": screen_size,
        "weight": weight,
        "eco_level": eco_level,
        "offset": offset,
        "limit": limit
    }

    result = neo4j_db.execute_query(query, params)
    laptops = [dict(record["l"]) for record in result]
    return laptops

