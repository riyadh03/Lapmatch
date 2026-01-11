# app/auth/firebase.py
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth, credentials
from app.services.user_service import create_user, get_user_by_uid

load_dotenv()

# Initialisation Firebase
if not firebase_admin._apps:
    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT")
    if service_account_path:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
    else:
        print("⚠️  Firebase non configuré, initialisation ignorée. Le backend peut démarrer mais l'authentification Firebase ne fonctionnera pas.")

def verify_firebase_token(id_token: str):
    """
    Vérifie le token Firebase et crée l'utilisateur Neo4j si nécessaire
    """
    try:
        if not firebase_admin._apps:
            return None
        
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token["uid"]
        email = decoded_token.get("email")

        user = get_user_by_uid(uid)
        if not user:
            user = create_user(uid, email)

        return {
            "uid": uid,
            "email": email
        }
    except Exception as e:
        print("Erreur Firebase:", e)
        return None
        