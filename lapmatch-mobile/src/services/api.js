
// src/services/api.js

import { getAuth } from "firebase/auth";

/**
 * URL de base du backend FastAPI
 * ⚠️ Si tu testes sur téléphone physique :
 * remplace 127.0.0.1 par ton IP locale via la commande ipconfig dans le cmd (ex: "http://192.168.11.107:8000")
 */
const BASE_URL = "http://192.168.11.107:8000";

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

  const response = await fetch(
    `${BASE_URL}/recommendations/expert?${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des recommandations expert");
  }

  return await response.json();
};
