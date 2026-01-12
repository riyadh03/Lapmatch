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

// Timeout pour les requêtes (75 secondes)
const REQUEST_TIMEOUT = 30000;

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
 * Crée une requête fetch avec timeout
 */
const fetchWithTimeout = async (url, options, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(
        `La requête a expiré après ${timeout}ms. Le serveur met trop de temps à répondre.`
      );
    }
    throw error;
  }
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
    console.log(
      `⏳ [API] Envoi de la requête (timeout: ${REQUEST_TIMEOUT}ms)...`
    );

    const response = await fetchWithTimeout(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      REQUEST_TIMEOUT
    );

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

    if (data && (data.laptops || data.data)) {
      return {
        ...data,
        laptops: data.laptops || data.data,
        data: data.data || data.laptops,
        success: data.success ?? true,
      };
    }

    return data;
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`❌ [API] Erreur après ${totalDuration}ms:`, error.message);

    // Gestion spécifique des erreurs réseau
    if (
      error.message.includes("Network request failed") ||
      error.message.includes("expiré")
    ) {
      console.error("🌐 [API] Problème réseau détecté:");
      console.error("  - Vérifiez votre connexion internet");
      console.error("  - Vérifiez que ngrok est actif");
      console.error("  - Vérifiez que le backend est démarré");
      throw new Error(
        "Problème de connexion réseau. Vérifiez votre connexion et que le serveur est accessible."
      );
    }

    if (error.message.includes("expiré")) {
      throw new Error(
        "Le serveur met trop de temps à répondre. Veuillez réessayer."
      );
    }

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

    const filteredParams = Object.fromEntries(
      Object.entries(params || {}).filter(([, v]) => v !== null && v !== undefined && v !== "")
    );
    const query = new URLSearchParams(filteredParams).toString();
    const url = `${BASE_URL}/recommendations/expert?${query}`;
    console.log("🌐 [API] URL complète:", url);

    const requestStartTime = Date.now();
    console.log(
      `⏳ [API] Envoi de la requête (timeout: ${REQUEST_TIMEOUT}ms)...`
    );

    const response = await fetchWithTimeout(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      REQUEST_TIMEOUT
    );

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

    // Gestion spécifique des erreurs réseau
    if (
      error.message.includes("Network request failed") ||
      error.message.includes("expiré")
    ) {
      console.error("🌐 [API] Problème réseau détecté:");
      console.error("  - Vérifiez votre connexion internet");
      console.error("  - Vérifiez que ngrok est actif");
      console.error("  - Vérifiez que le backend est démarré");
      throw new Error(
        "Problème de connexion réseau. Vérifiez votre connexion et que le serveur est accessible."
      );
    }

    if (error.message.includes("expiré")) {
      throw new Error(
        "Le serveur met trop de temps à répondre. Veuillez réessayer."
      );
    }

    console.error("❌ [API] Stack trace:", error.stack);
    throw error;
  }
};

/**
 * 🔹 Recherche par NOM
 * Appelle : GET /laptops/search
 */
export const fetchSearchByName = async (
  searchTerm,
  maxDistance = 3,
  limit = 20
) => {
  const startTime = Date.now();
  console.log("📡 [API] fetchSearchByName - Début");
  console.log(
    "📋 [API] Paramètres: searchTerm=",
    searchTerm,
    "maxDistance=",
    maxDistance,
    "limit=",
    limit
  );

  try {
    const token = await getAuthToken();
    console.log("🔑 [API] Token obtenu");

    const query = new URLSearchParams({
      search_term: searchTerm,
      max_distance: maxDistance.toString(),
      limit: limit.toString(),
    }).toString();
    const url = `${BASE_URL}/laptops/search?${query}`;
    console.log("🌐 [API] URL complète:", url);

    const requestStartTime = Date.now();
    console.log(
      `⏳ [API] Envoi de la requête (timeout: ${REQUEST_TIMEOUT}ms)...`
    );

    const response = await fetchWithTimeout(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      REQUEST_TIMEOUT
    );

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
          errorText || "Erreur lors de la recherche par nom"
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

    // Gestion spécifique des erreurs réseau
    if (
      error.message.includes("Network request failed") ||
      error.message.includes("expiré")
    ) {
      console.error("🌐 [API] Problème réseau détecté:");
      console.error("  - Vérifiez votre connexion internet");
      console.error("  - Vérifiez que ngrok est actif");
      console.error("  - Vérifiez que le backend est démarré");
      throw new Error(
        "Problème de connexion réseau. Vérifiez votre connexion et que le serveur est accessible."
      );
    }

    if (error.message.includes("expiré")) {
      throw new Error(
        "Le serveur met trop de temps à répondre. Veuillez réessayer."
      );
    }

    console.error("❌ [API] Stack trace:", error.stack);
    throw error;
  }
};

/**
 * 🔹 Récupération des laptops similaires
 * Appelle : GET /laptops/{laptop_id}/similar
 */
export const fetchSimilarLaptops = async (laptopId, limit = 5) => {
  const startTime = Date.now();
  console.log("📡 [API] fetchSimilarLaptops - Début");
  console.log("📋 [API] Paramètres: laptopId=", laptopId, "limit=", limit);

  try {
    const token = await getAuthToken();
    console.log("🔑 [API] Token obtenu");

    const url = `${BASE_URL}/laptops/${laptopId}/similar?limit=${limit}`;
    console.log("🌐 [API] URL complète:", url);

    const requestStartTime = Date.now();
    console.log(
      `⏳ [API] Envoi de la requête (timeout: ${REQUEST_TIMEOUT}ms)...`
    );

    const response = await fetchWithTimeout(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      REQUEST_TIMEOUT
    );

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
          errorText || "Erreur lors de la récupération des laptops similaires"
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

    // Gestion spécifique des erreurs réseau
    if (
      error.message.includes("Network request failed") ||
      error.message.includes("expiré")
    ) {
      console.error("🌐 [API] Problème réseau détecté:");
      console.error("  - Vérifiez votre connexion internet");
      console.error("  - Vérifiez que ngrok est actif");
      console.error("  - Vérifiez que le backend est démarré");
      throw new Error(
        "Problème de connexion réseau. Vérifiez votre connexion et que le serveur est accessible."
      );
    }

    if (error.message.includes("expiré")) {
      throw new Error(
        "Le serveur met trop de temps à répondre. Veuillez réessayer."
      );
    }

    console.error("❌ [API] Stack trace:", error.stack);
    throw error;
  }
};
