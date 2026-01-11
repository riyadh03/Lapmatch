import { View, Text, FlatList, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import PcCard from "../components/PcCard";
import { favoritesService } from "../services/favoritesService";

export default function ResultsScreen({ route, navigation }) {
  const { results } = route.params || {};
  const laptops = results?.data || results?.laptops || results || [];

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadFavorites();
    });
    loadFavorites();
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    const favs = await favoritesService.getFavorites();
    setFavorites(favs);
  };

  const isFavorite = (pc) => {
    const id = pc?.id ?? pc?.laptop_id;
    return favorites.some((fav) => (fav?.id ?? fav?.laptop_id) === id);
  };

  const handleFavoriteChange = async () => {
    await loadFavorites();
  };

  console.log(
    "[ResultsScreen] Données reçues:",
    laptops?.length || 0,
    "laptops"
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.listContainer}>
        <Text style={styles.headerText}>
          {laptops.length} laptop{laptops.length !== 1 ? "s" : ""} found
        </Text>

        <FlatList
          data={laptops.length > 0 ? laptops : []}
          keyExtractor={(item, index) =>
            item.id?.toString() ||
            item.laptop_id?.toString() ||
            index.toString()
          }
          renderItem={({ item }) => (
            <PcCard
              pc={item}
              onPress={() => navigation.navigate("PcDetails", { pc: item })}
              isFavoriteInitial={isFavorite(item)}
              onFavoriteChange={handleFavoriteChange}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12122C",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 16,
    color: "#A0A0BC",
    marginBottom: 15,
    fontWeight: "500",
  },
});
