# app/auth/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .firebase import verify_firebase_token
from app.services.user_service import get_user_by_uid

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    user = verify_firebase_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token Firebase invalide"
        )
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
