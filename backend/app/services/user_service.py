# app/services/user_service.py
from app.db.neo4j import get_driver
import os

def create_user(uid: str, email: str, user_type: str = "User"):
    """
    Crée un noeud utilisateur dans Neo4j si inexistant.
    user_type peut être "User" ou "Admin"
    """
    query = """
    MERGE (u:User {uid: $uid})
    ON CREATE SET u.email = $email, u.user_type = $user_type
    RETURN u    
    """
    driver = get_driver()
    with driver.session(database=os.getenv("NEO4J_DATABASE")) as session:
        result = session.run(query, uid=uid, email=email, user_type=user_type)
        return result.single()["u"]

def get_user_by_uid(uid: str):
    """
    Récupère un utilisateur par uid
    """
    query = "MATCH (u:User {uid: $uid}) RETURN u"
    driver = get_driver()
    with driver.session(database=os.getenv("NEO4J_DATABASE")) as session:
        result = session.run(query, uid=uid)
        record = result.single()
        return record["u"] if record else None
