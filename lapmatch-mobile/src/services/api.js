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
  const startTime = Date.now();
  console.log("📡 [API] fetchNonExpertRecommendations - Début");
  console.log("📋 [API] Paramètres:", params);

  try {
    const token = await getAuthToken();
    console.log("🔑 [API] Token obtenu");

    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/recommendations/non-expert?${query}`;
    console.log("🌐 [API] URL complète:", url);

    const requestStartTime = Date.now();
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const requestDuration = Date.now() - requestStartTime;
    console.log(`⏱️ [API] Requête HTTP terminée en ${requestDuration}ms`);
    console.log(
      `📊 [API] Status HTTP: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [API] Erreur HTTP:", response.status, errorText);
      throw new Error(
        `Erreur ${response.status}: ${
          errorText || "Erreur lors de la récupération des recommandations"
        }`
      );
    }

    const data = await response.json();
    const totalDuration = Date.now() - startTime;
    console.log(`✅ [API] Réponse reçue en ${totalDuration}ms total`);
    console.log(
      "📦 [API] Données reçues:",
      data?.success ? "Succès" : "Échec",
      "- Nombre d'éléments:",
      data?.data?.length || 0
    );

    return data;
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`❌ [API] Erreur après ${totalDuration}ms:`, error.message);
    console.error("❌ [API] Stack trace:", error.stack);
    throw error;
  }
};

/**
 * 🔹 Recherche EXPERT
 * Appelle : GET /recommendations/expert
 */
export const fetchExpertRecommendations = async (params) => {
  const startTime = Date.now();
  console.log("📡 [API] fetchExpertRecommendations - Début");
  console.log("📋 [API] Paramètres:", params);

  try {
    const token = await getAuthToken();
    console.log("🔑 [API] Token obtenu");

    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/recommendations/expert?${query}`;
    console.log("🌐 [API] URL complète:", url);

    const requestStartTime = Date.now();
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const requestDuration = Date.now() - requestStartTime;
    console.log(`⏱️ [API] Requête HTTP terminée en ${requestDuration}ms`);
    console.log(
      `📊 [API] Status HTTP: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [API] Erreur HTTP:", response.status, errorText);
      throw new Error(
        `Erreur ${response.status}: ${
          errorText ||
          "Erreur lors de la récupération des recommandations expert"
        }`
      );
    }

    const data = await response.json();
    const totalDuration = Date.now() - startTime;
    console.log(`✅ [API] Réponse reçue en ${totalDuration}ms total`);
    console.log(
      "📦 [API] Données reçues:",
      data?.success ? "Succès" : "Échec",
      "- Nombre d'éléments:",
      data?.data?.length || 0
    );

    return data;
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`❌ [API] Erreur après ${totalDuration}ms:`, error.message);
    console.error("❌ [API] Stack trace:", error.stack);
    throw error;
  }
};
