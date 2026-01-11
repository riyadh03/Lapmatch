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
    user_data = get_user_by_uid(current_user["uid"])
    if not user_data or user_data.get("user_type") != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé: rôle Admin requis"
        )
    return current_user
