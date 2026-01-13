import { View, Text, FlatList, StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import PcCard from "../components/PcCard";
import { favoritesService } from "../services/favoritesService";
import {
  fetchExpertRecommendations,
  fetchNonExpertRecommendations,
} from "../services/api";

export default function ResultsScreen({ route, navigation }) {
  const { results, resultsMeta } = route.params || {};
  const initialLaptops = results?.data || results?.laptops || results || [];

  const [laptops, setLaptops] = useState(initialLaptops);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(
    Number(resultsMeta?.searchParams?.offset ?? 0) + (Number(resultsMeta?.searchParams?.limit ?? 7) || 7)
  );

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

  const loadMore = async () => {
    if (isLoadingMore) return;
    if (!resultsMeta?.mode || !resultsMeta?.searchParams) return;
    if (!hasMore) return;

    const limit = Number(resultsMeta.searchParams.limit ?? 7) || 7;
    const nextParams = {
      ...resultsMeta.searchParams,
      offset,
      limit,
    };

    setIsLoadingMore(true);
    console.log("[ResultsScreen] 🔄 See more - mode:", resultsMeta.mode);
    console.log("[ResultsScreen] 🔄 See more - params:", nextParams);

    try {
      let data;
      if (resultsMeta.mode === "non-expert") {
        data = await fetchNonExpertRecommendations(nextParams);
      } else if (resultsMeta.mode === "expert") {
        data = await fetchExpertRecommendations(nextParams);
      } else {
        console.log("[ResultsScreen] ⚠️ mode inconnu, pagination ignorée:", resultsMeta.mode);
        return;
      }

      const newItems = data?.data || data?.laptops || [];
      console.log("[ResultsScreen] ✅ See more - reçus:", newItems?.length || 0);

      if (!newItems || newItems.length === 0) {
        setHasMore(false);
        return;
      }

      setLaptops((prev) => {
        const seen = new Set(prev.map((p) => p?.id ?? p?.laptop_id));
        const merged = [...prev];
        for (const item of newItems) {
          const id = item?.id ?? item?.laptop_id;
          if (!seen.has(id)) {
            seen.add(id);
            merged.push(item);
          }
        }
        return merged;
      });

      if (newItems.length < limit) {
        setHasMore(false);
      }
      setOffset((prev) => prev + limit);
    } catch (e) {
      console.error("[ResultsScreen] ❌ See more erreur:", e?.message || e);
    } finally {
      setIsLoadingMore(false);
    }
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
          ListFooterComponent={() => {
            if (!resultsMeta?.mode) return null;
            if (!hasMore) return null;
            return (
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[styles.loadMoreBtn, isLoadingMore && styles.loadMoreBtnDisabled]}
                  onPress={loadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.loadMoreText}>See more</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          }}
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
  footer: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  loadMoreBtn: {
    backgroundColor: "#4953DD",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loadMoreBtnDisabled: {
    opacity: 0.6,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "700",
  },
});
