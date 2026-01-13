# app/auth/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .firebase import verify_firebase_token
from app.services.user_service import get_user_by_uid
import time

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    auth_start = time.time()
    print(f"[AUTH] 🔐 Début de l'authentification...")
    token = credentials.credentials
    print(f"[AUTH] 🔑 Token reçu (longueur: {len(token)})")
    
    verify_start = time.time()
    user = verify_firebase_token(token)
    verify_duration = time.time() - verify_start
    print(f"[AUTH] ⏱️ Vérification Firebase terminée en {verify_duration:.2f}s")
    
    if not user:
        print(f"[AUTH] ❌ Token invalide")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token Firebase invalide"
        )
    
    auth_duration = time.time() - auth_start
    print(f"[AUTH] ✅ Authentification réussie en {auth_duration:.2f}s - UID: {user.get('uid', 'N/A')}")
    return user

def get_current_admin(
    current_user: dict = Depends(get_current_user)
):
    """
    Vérifie que l'utilisateur actuel est un Admin
    """
    uid = current_user.get("uid")
    email = current_user.get("email")
    print(f"[ADMIN] 🔎 Vérification admin - uid={uid}, email={email}")
    user_data = get_user_by_uid(uid)
    if not user_data:
        print(f"[ADMIN] ❌ Aucun user Neo4j trouvé pour uid={uid}")
    else:
        print(f"[ADMIN] 📄 Neo4j user_type={user_data.get('user_type')}, email={user_data.get('email')}")

    if not user_data or user_data.get("user_type") != "Admin":
        print(f"[ADMIN] ⛔ Accès refusé - rôle Admin requis")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé: rôle Admin requis"
        )
    print(f"[ADMIN] ✅ Accès admin accordé")
    return current_user
