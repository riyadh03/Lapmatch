# Backend (FastAPI)

## Installation

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

   - Créer un fichier `.env` dans le dossier `backend/`
   - Ajouter: `FIREBASE_SERVICE_ACCOUNT=secrets/firebase.json`
   - Configurer Neo4j si nécessaire

4. Démarrer l'API:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## Configuration IDE

Si votre IDE ne détecte pas les imports (FastAPI, etc.):

- **VS Code/Cursor**: `Ctrl+Shift+P` → "Python: Select Interpreter" → Choisir `venv/Scripts/python.exe`
- Chaque développeur configure son propre IDE (les fichiers `.vscode/` sont ignorés par git)
