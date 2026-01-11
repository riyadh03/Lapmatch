// src/services/api.js

import { getAuth } from "firebase/auth";

/**
 * Configuration de l'URL de base du backend FastAPI
 *
 * Pour utiliser ngrok (pour permettre aux collaborateurs de tester) :
 * 1. Installe ngrok : https://ngrok.com/download
 * 2. Lance ngrok : ngrok http 8000
 * 3. Copie l'URL HTTPS générée (ex: https://xxxx-xx-xx-xx-xx.ngrok-free.app)
 * 4. Définis la variable d'environnement EXPO_PUBLIC_NGROK_URL avec cette URL
 *    OU modifie directement NGROK_URL ci-dessous
 *
 * Pour développement local :
 * - Utilise ton IP locale (ex: "http://192.168.11.107:8000")
 * - Trouve ton IP avec : ipconfig (Windows) ou ifconfig (Mac/Linux)
 */
const NGROK_URL = "https://furlable-salina-stereochromically.ngrok-free.dev";
const LOCAL_URL = "http://192.168.11.107:8000";

/**
 * Détermine l'URL de base à utiliser
 * Priorité : ngrok > URL locale
 */
const getBaseUrl = () => {
  if (NGROK_URL) {
    console.log("🌐 Utilisation de ngrok:", NGROK_URL);
    return NGROK_URL;
  }
  console.log("🏠 Utilisation de l'URL locale:", LOCAL_URL);
  return LOCAL_URL;
};

const BASE_URL = getBaseUrl();

/**
 * Récupère le token Firebase de l'utilisateur connecté
 */
const getAuthToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Utilisateur non authentifié");
  }

  return await user.getIdToken();
};

/**
 * 🔹 Recherche NON-EXPERT
 * Appelle : GET /recommendations/non-expert
 */
export const fetchNonExpertRecommendations = async (params) => {
  const token = await getAuthToken();

  const query = new URLSearchParams(params).toString();

  const response = await fetch(
    `${BASE_URL}/recommendations/non-expert?${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des recommandations");
  }

  return await response.json();
};

/**
 * 🔹 Recherche EXPERT
 * Appelle : GET /recommendations/expert
 */
export const fetchExpertRecommendations = async (params) => {
  const token = await getAuthToken();

  const query = new URLSearchParams(params).toString();

  const response = await fetch(`${BASE_URL}/recommendations/expert?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération des recommandations expert"
    );
  }

  return await response.json();
};
