import os


def get_env(name: str, default: str | None = None) -> str | None:
    return os.getenv(name, default)


NEO4J_URI = get_env("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = get_env("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = get_env("NEO4J_PASSWORD")

FIREBASE_CREDENTIALS_PATH = get_env("FIREBASE_CREDENTIALS_PATH")
