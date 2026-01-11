import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

export const favoritesService = {
  // Récupérer tous les favoris
  getFavorites: async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      return [];
    }
  },

  // Ajouter un favori
  addFavorite: async (pc) => {
    try {
      const favorites = await favoritesService.getFavorites();
      const existingIndex = favorites.findIndex(fav => fav.id === pc.id);
      
      if (existingIndex === -1) {
        favorites.push(pc);
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
      const favorites = await favoritesService.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== pcId);
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
      const favorites = await favoritesService.getFavorites();
      return favorites.some(fav => fav.id === pcId);
    } catch (error) {
      console.error('Erreur lors de la vérification du favori:', error);
      return false;
    }
  },

  // Basculer l'état de favori
  toggleFavorite: async (pc) => {
    try {
      const isFav = await favoritesService.isFavorite(pc.id);
      if (isFav) {
        await favoritesService.removeFavorite(pc.id);
        return false; // N'est plus un favori
      } else {
        await favoritesService.addFavorite(pc);
        return true; // Est maintenant un favori
      }
    } catch (error) {
      console.error('Erreur lors du basculement du favori:', error);
      return false;
    }
  }
};
