# app/auth/firebase.py
import firebase_admin
from firebase_admin import auth, credentials
from app.services.user_service import create_user, get_user_by_uid
import os

# Initialisation Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT"))
    firebase_admin.initialize_app(cred)

def verify_firebase_token(id_token: str):
    """
    Vérifie le token Firebase et crée l'utilisateur Neo4j si nécessaire
    """
    try:
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


# import os
# import firebase_admin
# from firebase_admin import auth, credentials
# from app.services.user_service import create_user, get_user_by_uid

# if not firebase_admin._apps:
#     service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT")
#     if service_account_path:
#         cred = credentials.Certificate(service_account_path)
#         firebase_admin.initialize_app(cred)
#     else:
#         print("Firebase non configuré, initialisation ignorée")
        