from neo4j import GraphDatabase
from dotenv import load_dotenv
import os
from pathlib import Path
from neo4j.exceptions import AuthError

# Charger le .env depuis le dossier backend
backend_dir = Path(__file__).parent.parent.parent
root_env_path = backend_dir.parent / ".env"
backend_env_path = backend_dir / ".env"
load_dotenv(dotenv_path=backend_env_path)
load_dotenv(dotenv_path=root_env_path, override=True)

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
NEO4J_DATABASE = os.getenv("NEO4J_DATABASE", "laptopdatabase")

# Log de configuration au chargement du module
print(f"[NEO4J] 📋 Configuration chargée:")
print(f"[NEO4J]   URI: {NEO4J_URI}")
print(f"[NEO4J]   USER: {NEO4J_USER}")
print(f"[NEO4J]   DATABASE: {NEO4J_DATABASE}")
print(f"[NEO4J]   PASSWORD: {'***' if NEO4J_PASSWORD else 'NON DÉFINI'}")


class Neo4jDatabase:
    def __init__(self):
        self.driver = None
        self._connection_attempted = False

    def _ensure_connection(self):
        """Établit la connexion seulement si nécessaire (lazy connection)"""
        if self.driver is not None:
            return
        
        import time
        init_start = time.time()
        print(f"[NEO4J] 🔌 Connexion à Neo4j: {NEO4J_URI or 'NON CONFIGURÉ'}")
        
        if not NEO4J_URI or not NEO4J_USER or not NEO4J_PASSWORD:
            print(f"[NEO4J] ⚠️ Variables d'environnement Neo4j non configurées")
            print(f"[NEO4J] ⚠️ URI: {NEO4J_URI}, USER: {NEO4J_USER}, PASSWORD: {'***' if NEO4J_PASSWORD else 'NON DÉFINI'}")
            raise RuntimeError("Variables d'environnement Neo4j non configurées. Vérifiez votre fichier .env")
        
        try:
            self.driver = GraphDatabase.driver(
                NEO4J_URI,
                auth=(NEO4J_USER, NEO4J_PASSWORD),
                connection_timeout=5,
                keep_alive=True,
            )
            # Test de connexion
            with self.driver.session(database=NEO4J_DATABASE) as session:
                session.run("RETURN 1")
            init_duration = time.time() - init_start
            print(f"[NEO4J] ✅ Connexion établie en {init_duration:.2f}s")
            self._connection_attempted = True
        except Exception as e:
            print(f"[NEO4J] ❌ Erreur de connexion: {e}")
            if isinstance(e, AuthError):
                print("[NEO4J] 🔐 Échec d'authentification Neo4j")
                print(f"[NEO4J]   URI: {NEO4J_URI}")
                print(f"[NEO4J]   USER: {NEO4J_USER}")
                print(f"[NEO4J]   DATABASE: {NEO4J_DATABASE}")
                print("[NEO4J] 💡 Vérifiez que le mot de passe Neo4j Desktop correspond à NEO4J_PASSWORD (.env)")
            print(f"[NEO4J] 💡 Vérifiez que Neo4j est démarré et accessible à {NEO4J_URI}")
            self._connection_attempted = True
            raise

    def close(self):
        if self.driver:
            self.driver.close()
            self.driver = None

    def execute_query(self, query: str, parameters: dict = None):
        # Connexion lazy - se connecte seulement quand nécessaire
        self._ensure_connection()
        
        import time
        exec_start = time.time()
        print(f"[NEO4J] 📤 Exécution de la requête...")
        try:
            with self.driver.session(database=NEO4J_DATABASE) as session:
                result = session.run(query, parameters or {})
                records = [record.data() for record in result]
                exec_duration = time.time() - exec_start
                print(f"[NEO4J] ✅ Requête exécutée en {exec_duration:.2f}s - {len(records)} enregistrements")
                return records
        except Exception as e:
            exec_duration = time.time() - exec_start
            print(f"[NEO4J] ❌ Erreur après {exec_duration:.2f}s: {e}")
            raise


# Instance globale
neo4j_db = Neo4jDatabase()
