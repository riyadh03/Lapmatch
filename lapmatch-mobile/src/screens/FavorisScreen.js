import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import PcCard from '../components/PcCard';
import { favoritesService } from '../services/favoritesService';

export default function FavorisScreen({ route, navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    loadFavorites();
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favs = await favoritesService.getFavorites();
      setFavorites(favs);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteChange = async () => {
    await loadFavorites();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.listContainer}>
        <Text style={styles.headerText}>
          {favorites.length} favori{favorites.length !== 1 ? 's' : ''}
        </Text>

        {loading ? (
          <Text style={styles.loadingText}>Chargement...</Text>
        ) : favorites.length === 0 ? (
          <Text style={styles.emptyText}>Aucun favori pour le moment</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item, index) =>
              item.id?.toString() || item.laptop_id?.toString() || index.toString()
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item, index }) => (
              <PcCard
                pc={item}
                onPress={() => navigation.navigate('PcDetails', { pc: item })}
                style={{ marginTop: index === 0 ? 0 : 15 }}
                isFavoriteInitial={true}
                onFavoriteChange={handleFavoriteChange}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12122C',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  headerText: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 10,
    marginLeft: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
  },
});
