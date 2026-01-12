# app/services/user_service.py
from app.db.neo4j import get_driver
import os

def create_user(
    uid: str,
    email: str,
    user_type: str = "User",
    full_name: str = None,
    total_spent: float = None,
):
    """
    Crée un noeud utilisateur dans Neo4j si inexistant.
    user_type peut être "User" ou "Admin"
    """
    query = """
    MERGE (u:User {uid: $uid})
    ON CREATE SET
        u.email = $email,
        u.user_type = $user_type,
        u.full_name = $full_name,
        u.total_spent = $total_spent
    SET
        u.email = $email,
        u.user_type = $user_type,
        u.full_name = coalesce($full_name, u.full_name),
        u.total_spent = coalesce($total_spent, u.total_spent)
    RETURN u    
    """
    driver = get_driver()
    with driver.session(database=os.getenv("NEO4J_DATABASE")) as session:
        result = session.run(
            query,
            uid=uid,
            email=email,
            user_type=user_type,
            full_name=full_name,
            total_spent=total_spent,
        )
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


def list_users():
    query = """
    MATCH (u:User)
    RETURN u
    ORDER BY u.email
    """
    driver = get_driver()
    with driver.session(database=os.getenv("NEO4J_DATABASE")) as session:
        result = session.run(query)
        return [dict(record["u"]) for record in result]


def update_user_by_uid(
    uid: str,
    email: str = None,
    user_type: str = None,
    full_name: str = None,
    total_spent: float = None,
):
    query = """
    MATCH (u:User {uid: $uid})
    SET
        u.email = coalesce($email, u.email),
        u.user_type = coalesce($user_type, u.user_type),
        u.full_name = coalesce($full_name, u.full_name),
        u.total_spent = coalesce($total_spent, u.total_spent)
    RETURN u
    """
    driver = get_driver()
    with driver.session(database=os.getenv("NEO4J_DATABASE")) as session:
        result = session.run(
            query,
            uid=uid,
            email=email,
            user_type=user_type,
            full_name=full_name,
            total_spent=total_spent,
        )
        record = result.single()
        return record["u"] if record else None


def delete_user_by_uid(uid: str) -> bool:
    query = """
    MATCH (u:User {uid: $uid})
    DETACH DELETE u
    RETURN count(u) AS deleted
    """
    driver = get_driver()
    with driver.session(database=os.getenv("NEO4J_DATABASE")) as session:
        result = session.run(query, uid=uid)
        record = result.single()
        return bool(record and (record["deleted"] or 0) > 0)
