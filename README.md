# LapMatch

LapMatch est une application de **recommandation de laptops**.

Le projet combine:

- une API (FastAPI) qui interroge Neo4j pour proposer des recommandations
- une application mobile (Expo) pour effectuer une recherche simple ou avancée
- une couche d'authentification via Firebase (selon la configuration)

## Fonctionnalités

- **Recommandations non-expert**: recherche guidée par usage (gaming, études, etc.)
- **Recommandations expert (Advanced Search)**: filtres CPU/GPU/RAM/stockage/écran/poids/budget
- **Recherche par nom** (selon routes disponibles)
- **Mise à jour d'images** (endpoint admin) via scraping depuis `external_link` (selon data)

## Stack

- **Backend**: FastAPI, Neo4j driver, python-dotenv
- **Base de données**: Neo4j
- **Auth**: Firebase Admin SDK (backend) + Firebase Auth (mobile)
- **Mobile**: React Native (Expo)
- **Infra dev**: Docker Compose (Neo4j + backend + ngrok)

## Structure

- DATA_MANAGEMENT/ : historique + data + notebooks (ne pas modifier)
- backend/ : API FastAPI
- lapmatch-mobile/ : application mobile (Expo)
- neo4j/ : scripts Cypher (logique graphe)

## Architecture (haut niveau)

- Le mobile appelle l'API via ngrok (ou URL locale)
- L'API exécute des requêtes Cypher sur Neo4j
- Les endpoints de recommandations retournent des listes de laptops JSON

## Démarrage (recommandé)

### 1) Démarrer Neo4j + Backend + Ngrok (1 seule commande)

1. Créer et remplir le fichier `.env` à la racine du projet (`LapMatch/.env`).
2. Lancer:

```bash
docker compose up --build
```

Pour tout arrêter:

```bash
docker compose down
```

### 2) Lancer l'app mobile (Expo) (séparément)

```bash
cd lapmatch-mobile
npx expo start
```

## Variables d'environnement

Le fichier `.env` à la racine est utilisé par `docker compose`.

- **NEO4J_URI**: doit pointer vers le service Docker `neo4j` (ex: `bolt://neo4j:7687`)
- **NGROK_AUTHTOKEN**: token ngrok requis pour exposer l'API

## URLs utiles

- Backend: `http://localhost:8000/health`
- Health Neo4j: `http://localhost:8000/health/neo4j`
- Neo4j Browser: `http://localhost:7474`
- Ngrok dashboard: `http://localhost:4040`

