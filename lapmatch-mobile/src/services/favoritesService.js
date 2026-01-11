import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

const getPcId = (pcOrId) => {
  if (pcOrId === null || pcOrId === undefined) return undefined;
  if (typeof pcOrId === 'number' || typeof pcOrId === 'string') return pcOrId;
  return pcOrId.id ?? pcOrId.laptop_id;
};

const normalizePc = (pc) => {
  const id = getPcId(pc);
  return id === undefined ? pc : { ...pc, id };
};

export const favoritesService = {
  // Récupérer tous les favoris
  getFavorites: async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites).map(normalizePc) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      return [];
    }
  },

  // Ajouter un favori
  addFavorite: async (pc) => {
    try {
      const normalizedPc = normalizePc(pc);
      const pcId = getPcId(normalizedPc);
      if (pcId === undefined) return false;

      const favorites = await favoritesService.getFavorites();
      const existingIndex = favorites.findIndex(fav => getPcId(fav) === pcId);
      
      if (existingIndex === -1) {
        favorites.push(normalizedPc);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du favori:', error);
      return false;
    }
  },

  // Supprimer un favori
  removeFavorite: async (pcId) => {
    try {
      const id = getPcId(pcId);
      if (id === undefined) return false;

      const favorites = await favoritesService.getFavorites();
      const updatedFavorites = favorites.filter(fav => getPcId(fav) !== id);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
      return false;
    }
  },

  // Vérifier si un PC est en favori
  isFavorite: async (pcId) => {
    try {
      const id = getPcId(pcId);
      if (id === undefined) return false;

      const favorites = await favoritesService.getFavorites();
      return favorites.some(fav => getPcId(fav) === id);
    } catch (error) {
      console.error('Erreur lors de la vérification du favori:', error);
      return false;
    }
  },

  // Basculer l'état de favori
  toggleFavorite: async (pc) => {
    try {
      const normalizedPc = normalizePc(pc);
      const pcId = getPcId(normalizedPc);
      if (pcId === undefined) return false;

      const isFav = await favoritesService.isFavorite(pcId);
      if (isFav) {
        await favoritesService.removeFavorite(pcId);
        return false; // N'est plus un favori
      } else {
        await favoritesService.addFavorite(normalizedPc);
        return true; // Est maintenant un favori
      }
    } catch (error) {
      console.error('Erreur lors du basculement du favori:', error);
      return false;
    }
  }
};
