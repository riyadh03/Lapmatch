# LapMatch Mobile (Expo)

## Prérequis

- Node.js + npm
- Expo Go (sur téléphone) ou un émulateur

## Installation

Depuis `lapmatch-mobile/`:

```bash
npm install
```

## Lancer l'app

### Recommandé (backend via Docker)

1. Démarre l'infra (Neo4j + backend + ngrok) depuis la racine du repo:

```bash
docker compose up --build
```

2. Lance l'app mobile:

```bash
npx expo start
```

## URL backend (important)

Les appels API sont faits via `src/services/api.js`.

- L'URL de l'API peut être fournie via:
  - `EXPO_PUBLIC_API_URL` (recommandé)

Exemple:

```bash
EXPO_PUBLIC_API_URL=https://xxxx.ngrok-free.app npx expo start
```

## Dépannage

- Si tu as des timeouts:
  - vérifie que le backend est accessible via `http://localhost:8000/health`
  - vérifie le dashboard ngrok sur `http://localhost:4040`
  - vérifie que l'URL ngrok utilisée par le front correspond à la session ngrok en cours
