# TODO: LapMatch main recommendation algorithm

from app.core.neo4j import neo4j_db

def recommend_non_expert(
    usage_name: str,
    max_price: float,
    min_rating: float,
    storage_gb: int,
    offset: int = 0,
    limit: int = 7
):
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

    result = neo4j_db.execute_query(query, params)

    # Conversion Neo4j → dict JSON
    laptops = [record["l"] for record in result]
    return laptops
