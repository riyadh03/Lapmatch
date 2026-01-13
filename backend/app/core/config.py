import os
from typing import Optional
from pathlib import Path
from dotenv import load_dotenv


# Charger les variables d'environnement depuis .env (racine du repo et/ou backend)
backend_dir = Path(__file__).parent.parent.parent
root_env_path = backend_dir.parent / ".env"
backend_env_path = backend_dir / ".env"
load_dotenv(dotenv_path=backend_env_path)
load_dotenv(dotenv_path=root_env_path, override=True)


def get_env(name: str, default: Optional[str] = None) -> Optional[str]:
    return os.getenv(name, default)


NEO4J_URI = get_env("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = get_env("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = get_env("NEO4J_PASSWORD")
NEO4J_DATABASE = get_env("NEO4J_DATABASE", "laptopdatabase")

FIREBASE_CREDENTIALS_PATH = get_env("FIREBASE_CREDENTIALS_PATH")
