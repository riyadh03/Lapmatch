# app/auth/firebase.py
import os
from pathlib import Path
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth, credentials
from app.services.user_service import create_user, get_user_by_uid, update_user_by_uid
import traceback

backend_dir = Path(__file__).parent.parent.parent
root_env_path = backend_dir.parent / ".env"
backend_env_path = backend_dir / ".env"
load_dotenv(dotenv_path=backend_env_path)
load_dotenv(dotenv_path=root_env_path, override=True)

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
                try:
                    app = firebase_admin.get_app()
                    print(f"[OK] Firebase initialise avec succes (project_id={app.project_id})")
                except Exception:
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
    import time
    start_time = time.time()
    print(f"[FIREBASE] 🔐 Début de la vérification du token...")
    
    try:
        if not firebase_admin._apps:
            print(f"[FIREBASE] ❌ Firebase non initialisé")
            return None
        
        verify_start = time.time()
        decoded_token = auth.verify_id_token(id_token)
        verify_duration = time.time() - verify_start
        print(f"[FIREBASE] ✅ Token vérifié en {verify_duration:.2f}s")
        
        uid = decoded_token["uid"]
        email = decoded_token.get("email")
        print(f"[FIREBASE] 👤 UID: {uid}, Email: {email}")

        neo4j_start = time.time()
        user = get_user_by_uid(uid)
        neo4j_duration = time.time() - neo4j_start
        print(f"[FIREBASE] ⏱️ get_user_by_uid en {neo4j_duration:.2f}s")
        
        if not user:
            print(f"[FIREBASE] ➕ Création de l'utilisateur dans Neo4j...")
            create_start = time.time()
            user = create_user(uid, email)
            create_duration = time.time() - create_start
            print(f"[FIREBASE] ✅ Utilisateur créé en {create_duration:.2f}s")
        else:
            print(f"[FIREBASE] ✅ Utilisateur trouvé dans Neo4j")

        bootstrap_emails_raw = os.getenv("BOOTSTRAP_ADMIN_EMAILS")
        email_for_bootstrap = email or (user.get("email") if user else None)
        if bootstrap_emails_raw:
            try:
                bootstrap_list = [e.strip().lower() for e in bootstrap_emails_raw.split(",") if e.strip()]
                print(f"[FIREBASE] 🧾 BOOTSTRAP_ADMIN_EMAILS configuré (count={len(bootstrap_list)})")
            except Exception:
                print(f"[FIREBASE] 🧾 BOOTSTRAP_ADMIN_EMAILS configuré")
        if bootstrap_emails_raw and email_for_bootstrap:
            bootstrap_emails = {
                e.strip().lower() for e in bootstrap_emails_raw.split(",") if e.strip()
            }
            print(f"[FIREBASE] 🧭 Email utilisé pour bootstrap: {email_for_bootstrap}")
            if email_for_bootstrap.strip().lower() in bootstrap_emails:
                current_user_type = user.get("user_type") if user else None
                if current_user_type != "Admin":
                    promoted = update_user_by_uid(uid, user_type="Admin")
                    if promoted:
                        user = promoted
                    print(f"[FIREBASE] 🛡️ Bootstrap admin appliqué pour {email_for_bootstrap}")
                else:
                    print(f"[FIREBASE] 🛡️ Bootstrap admin déjà en place (user_type=Admin)")
                if user:
                    print(f"[FIREBASE] ✅ user_type final: {user.get('user_type')}")
            else:
                print(f"[FIREBASE] 📴 Bootstrap admin non appliqué (email non listé)")
        elif bootstrap_emails_raw and not email_for_bootstrap:
            print(f"[FIREBASE] 📴 Bootstrap admin ignoré (aucun email disponible)")

        total_duration = time.time() - start_time
        print(f"[FIREBASE] 🏁 Vérification terminée en {total_duration:.2f}s total")
        
        return {
            "uid": uid,
            "email": email
        }
    except Exception as e:
        duration = time.time() - start_time
        print(f"[FIREBASE] ❌ Erreur après {duration:.2f}s: {e}")
        print(f"[FIREBASE] ❌ Type: {type(e).__name__}")
        print(f"[FIREBASE] ❌ Traceback:\n{traceback.format_exc()}")
        return None