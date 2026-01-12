import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { fetchSimilarLaptops } from "../services/api";
import PcCard from "../components/PcCard";

export default function PcDetailsScreen({ route, navigation }) {
  const { pc } = route.params;
  const insets = useSafeAreaInsets();
  const [similarLaptops, setSimilarLaptops] = useState([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);

  // Charger les laptops similaires au montage du composant
  useEffect(() => {
    const loadSimilarLaptops = async () => {
      if (!pc.laptop_id && !pc.id) {
        console.log(
          "[PcDetails] ⚠️ Pas de laptop_id, impossible de charger les similaires"
        );
        return;
      }

      const laptopId = pc.laptop_id || pc.id;
      setIsLoadingSimilar(true);

      try {
        console.log(
          "[PcDetails] 🔍 Chargement des laptops similaires pour:",
          laptopId
        );
        const response = await fetchSimilarLaptops(laptopId, 5);

        if (response?.success && response?.data) {
          // Exclure le laptop actuel des résultats similaires
          const filtered = response.data.filter(
            (laptop) =>
              (laptop.laptop_id || laptop.id) !== (pc.laptop_id || pc.id)
          );
          setSimilarLaptops(filtered);
          console.log(
            "[PcDetails] ✅",
            filtered.length,
            "laptops similaires chargés"
          );
        }
      } catch (error) {
        console.error(
          "[PcDetails] ❌ Erreur lors du chargement des similaires:",
          error.message
        );
        // En cas d'erreur, on continue sans afficher d'erreur visible à l'utilisateur
      } finally {
        setIsLoadingSimilar(false);
      }
    };

    loadSimilarLaptops();
  }, [pc.laptop_id, pc.id]);

  // Extraire la marque du premier mot du nom
  const getBrand = (name) => {
    if (!name) return "Marque inconnue";
    const firstWord = name.trim().split(/\s+/)[0];
    return firstWord || "Marque inconnue";
  };

  // Fonction pour formater le stockage
  const formatStorage = (storageGb) => {
    if (!storageGb) return "N/A";
    if (storageGb >= 1024) {
      return `${(storageGb / 1024).toFixed(1)} TB`;
    }
    return `${storageGb} GB`;
  };

  // Fonction pour afficher les étoiles de rating
  const renderStars = (rating) => {
    if (!rating || rating === null || rating === undefined) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<AntDesign key={i} name="star" size={18} color="#f1c40f" />);
    }
    if (hasHalfStar) {
      stars.push(
        <AntDesign
          key="half"
          name="star"
          size={18}
          color="#f1c40f"
          style={{ opacity: 0.5 }}
        />
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <AntDesign key={`empty-${i}`} name="staro" size={18} color="#f1c40f" />
      );
    }
    return stars;
  };

  // Construire les spécifications depuis les vraies données
  const specifications = [
    {
      id: 1,
      name: "CPU",
      value: pc.cpu || "Non spécifié",
      icon: "chip",
      type: "MaterialCommunity",
    },
    {
      id: 2,
      name: "GPU",
      value: pc.gpu || "Non spécifié",
      icon: "monitor",
      type: "MaterialCommunity",
    },
    {
      id: 3,
      name: "RAM",
      value: pc.ram_gb ? `${pc.ram_gb} GB` : "Non spécifié",
      icon: "memory",
      type: "MaterialCommunity",
    },
    {
      id: 4,
      name: "Storage",
      value: formatStorage(pc.storage_gb),
      icon: "harddisk",
      type: "MaterialCommunity",
    },
    {
      id: 5,
      name: "Screen",
      value: pc.screen_size ? `${pc.screen_size}"` : "Non spécifié",
      icon: "monitor",
      type: "MaterialCommunity",
    },
  ];

  const renderIcon = (item) => {
    if (item.type === "Ionicons") {
      return <Ionicons name={item.icon} size={24} color="#7f8c8d" />;
    } else if (item.type === "MaterialCommunity") {
      return (
        <MaterialCommunityIcons name={item.icon} size={24} color="#7f8c8d" />
      );
    }
    return null;
  };

  return (
    <View
      style={[
        styles.safeArea,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container}>
        <Image
          source={{
            uri: (
              pc.image_link ||
              pc.image_url ||
              pc.image ||
              "https://via.placeholder.com/400x300"
            ).toString(),
          }}
          style={styles.image}
          resizeMode="cover"
          defaultSource={{ uri: "https://via.placeholder.com/400x300" }}
        />

        <View style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.brandText}>{getBrand(pc.name)}</Text>
            {pc.rating !== null && pc.rating !== undefined && (
              <View style={styles.ratingContainer}>
                <View style={styles.starsRow}>{renderStars(pc.rating)}</View>
                <Text style={styles.ratingText}>{pc.rating?.toFixed(1)}</Text>
              </View>
            )}
          </View>

          <Text style={styles.nameText}>{pc.name || "Nom non disponible"}</Text>

          <Text style={styles.priceText}>
            {pc.price
              ? `${pc.price.toLocaleString()} dh`
              : "Prix non disponible"}
          </Text>

          {/* Section Spécifications */}
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specsContainer}>
            {specifications.map((item) => (
              <View key={item.id} style={styles.specCard}>
                <View style={styles.specIcon}>{renderIcon(item)}</View>
                <View>
                  <Text style={styles.specName}>{item.name}</Text>
                  <Text style={styles.specValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Le bouton d'achat */}
          {pc.external_link && (
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => Linking.openURL(pc.external_link)}
              activeOpacity={0.8}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.buyButtonText}>Buy Now</Text>
                <MaterialCommunityIcons
                  name="arrow-top-right"
                  size={16}
                  color="#fff"
                  style={{ marginLeft: 5 }}
                />
              </View>
            </TouchableOpacity>
          )}

          {/* Section Produits similaires */}
          {similarLaptops.length > 0 && (
            <View style={styles.similarSection}>
              <Text style={styles.sectionTitle}>Produits similaires</Text>
              {isLoadingSimilar ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#4953DD" />
                  <Text style={styles.loadingText}>Chargement...</Text>
                </View>
              ) : (
                <FlatList
                  data={similarLaptops}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) =>
                    (item.laptop_id || item.id || Math.random()).toString()
                  }
                  contentContainerStyle={styles.similarList}
                  renderItem={({ item }) => (
                    <View style={styles.similarCardContainer}>
                      <PcCard
                        pc={item}
                        onPress={() =>
                          navigation.push("PcDetails", { pc: item })
                        }
                        style={styles.similarCard}
                      />
                    </View>
                  )}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F1424", // Fond principal bleu nuit
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 60, // Standard header height
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#ecf0f1",
    marginLeft: 5,
    fontSize: 16,
  },
  headerTitle: {
    color: "#ecf0f1",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 250, // Hauteur d'image adaptée au design
    resizeMode: "cover",
  },
  detailsContainer: {
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  brandText: {
    color: "#7f8c8d", // Gris pour la marque
    fontSize: 14,
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e273b",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  starsRow: {
    flexDirection: "row",
    marginRight: 6,
  },
  ratingText: {
    marginLeft: 4,
    color: "#ecf0f1",
    fontSize: 14,
    fontWeight: "bold",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ecf0f1",
    marginBottom: 15,
  },
  priceText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2ecc71", // Vert vif pour le prix
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ecf0f1",
    marginBottom: 15,
  },
  specsContainer: {
    marginBottom: 30,
  },
  specCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161d2d", // Fond des cartes de spécifications
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  specIcon: {
    marginRight: 15,
  },
  specName: {
    color: "#7f8c8d",
    fontSize: 12,
  },
  specValue: {
    color: "#ecf0f1",
    fontSize: 16,
    fontWeight: "600",
  },
  buyButton: {
    backgroundColor: "#3498db", // Un bleu clair pour le bouton d'action
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  buyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  similarSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  similarList: {
    paddingRight: 20,
  },
  similarCardContainer: {
    width: 280,
    marginRight: 15,
  },
  similarCard: {
    marginBottom: 0,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    color: "#A0A0BC",
    marginLeft: 10,
    fontSize: 14,
  },
});
