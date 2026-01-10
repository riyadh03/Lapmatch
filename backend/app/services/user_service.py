# app/services/user_service.py
from app.db.neo4j import get_driver
import os

def create_user(uid: str, email: str):
    """
    Crée un noeud utilisateur dans Neo4j si inexistant.
    Pas de rôle pour le moment.
    """
    query = """
    MERGE (u:User {uid: $uid})
    ON CREATE SET u.email = $email
    RETURN u
    """
    driver = get_driver()
    with driver.session(database=os.getenv("NEO4J_DATABASE")) as session:
        result = session.run(query, uid=uid, email=email)
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
