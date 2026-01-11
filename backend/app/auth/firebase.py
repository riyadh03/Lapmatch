# app/auth/firebase.py
import os
from pathlib import Path
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth, credentials
from app.services.user_service import create_user, get_user_by_uid

load_dotenv()

# Initialisation Firebase
if not firebase_admin._apps:
    # Cherche la variable d'environnement (plusieurs noms possibles)
    service_account_path = (
        os.getenv("FIREBASE_SERVICE_ACCOUNT") or 
        os.getenv("FIREBASE_CREDENTIALS_PATH")
    )
    
    if service_account_path:
        # Si le chemin est relatif, le rendre absolu depuis le dossier backend
        if not os.path.isabs(service_account_path):
            # Chemin relatif depuis le dossier backend
            backend_dir = Path(__file__).parent.parent.parent
            service_account_path = backend_dir / service_account_path
        
        # Vérifier que le fichier existe
        if os.path.exists(service_account_path):
            try:
                cred = credentials.Certificate(str(service_account_path))
                firebase_admin.initialize_app(cred)
                print("[OK] Firebase initialise avec succes")
            except Exception as e:
                print(f"[ERREUR] Erreur lors de l'initialisation Firebase: {e}")
        else:
            print(f"[WARNING] Fichier Firebase introuvable: {service_account_path}")
            print("[WARNING] Firebase non configure, initialisation ignoree. Le backend peut demarrer mais l'authentification Firebase ne fonctionnera pas.")
    else:
        print("[WARNING] Firebase non configure, initialisation ignoree. Le backend peut demarrer mais l'authentification Firebase ne fonctionnera pas.")
        print("[INFO] Definissez FIREBASE_SERVICE_ACCOUNT ou FIREBASE_CREDENTIALS_PATH dans votre .env")

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
        