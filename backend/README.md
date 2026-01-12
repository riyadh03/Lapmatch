# Backend (FastAPI)

## Démarrage (recommandé via Docker)

Le backend est prévu pour être lancé via `docker compose` depuis la racine du repo.

```bash
docker compose up --build
```

Le fichier `.env` utilisé est celui à la racine (`LapMatch/.env`).

Pour arrêter:

```bash
docker compose down
```

## URLs utiles

- `http://localhost:8000/health`
- `http://localhost:8000/health/neo4j`

## Installation (option dev local)

1. Créer un environnement virtuel:

   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

2. Installer les dépendances:

   ```bash
   pip install -r requirements.txt
   ```

3. Configurer les variables d'environnement:

   - Copier l'exemple `backend/.env.example` et adapter les valeurs
   - Neo4j:
     - `NEO4J_URI` (ex: `bolt://localhost:7687` en local, ou `bolt://neo4j:7687` via Docker)
     - `NEO4J_USER`, `NEO4J_PASSWORD`, `NEO4J_DATABASE`
   - Firebase (optionnel):
     - `FIREBASE_SERVICE_ACCOUNT` ou `FIREBASE_CREDENTIALS_PATH` vers un JSON de service account

4. Démarrer l'API:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## Configuration IDE

Si votre IDE ne détecte pas les imports (FastAPI, etc.):

- **VS Code/Cursor**: `Ctrl+Shift+P` → "Python: Select Interpreter" → Choisir `venv/Scripts/python.exe`
- Chaque développeur configure son propre IDE (les fichiers `.vscode/` sont ignorés par git)
