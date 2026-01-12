import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // On utilise Ionicons pour toutes les icônes
import { fetchSearchByName } from "../services/api";

// --- Composant SearchCard Intégré ---
const SearchCard = ({
  title,
  description,
  badgeText,
  onPress,
  iconName,
  badgeColor,
  iconColor,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        {/* Icône dans la carte */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: iconColor || "#6200EE" },
          ]}
        >
          <Ionicons name={iconName} size={24} color="#FFF" />
        </View>
        {badgeText && (
          <View
            style={[styles.badge, { backgroundColor: badgeColor || "#2ecc71" }]}
          >
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const [pcList, setPcList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      navigation.replace("Login");
    }
  }, []);

  const handleSearch = async () => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      Alert.alert(
        "Terme de recherche trop court",
        "Veuillez saisir au moins 2 caractères pour effectuer une recherche."
      );
      return;
    }

    setIsSearching(true);
    try {
      console.log("[HomeScreen] 🔍 Recherche de:", searchTerm);
      const response = await fetchSearchByName(searchTerm.trim());

      if (response?.success && response?.data) {
        navigation.navigate("Results", {
          results: response.data,
        });
      } else {
        Alert.alert(
          "Aucun résultat",
          "Aucun laptop trouvé pour cette recherche."
        );
      }
    } catch (err) {
      console.error("[HomeScreen] ❌ Erreur:", err.message);
      Alert.alert(
        "Erreur",
        err.message || "Une erreur est survenue lors de la recherche."
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>How do you want to search?</Text>
      <Text style={styles.subtitle}>
        Choose based on your technical knowledge
      </Text>

      {/* 🔍 Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#A0A0BC"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par nom (ex: Lenovo, MacBook...)"
            placeholderTextColor="#6A6A8A"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchTerm("")}
              style={styles.clearSearchButton}
            >
              <Ionicons name="close-circle" size={20} color="#A0A0BC" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.searchButton,
            isSearching && styles.searchButtonDisabled,
          ]}
          onPress={handleSearch}
          disabled={isSearching}
          activeOpacity={0.8}
        >
          {isSearching ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {/* ✅ Simple Search avec icône de PC */}
        <SearchCard
          title="Simple Search"
          description="Answer a few easy questions about your needs and budget. Perfect for beginners."
          badgeText="Recommended"
          badgeColor="#2ecc71"
          iconColor="#2ecc71"
          iconName="sparkles" // Icône simple
          onPress={() => navigation.navigate("SimpleSearch")}
        />

        {/* ✅ Advanced Search avec icône settings */}
        <SearchCard
          title="Advanced Search"
          description="Specify exact technical requirements like CPU, GPU, RAM, and more."
          badgeText="For Experts"
          badgeColor="#4285F4"
          iconColor="#4285F4"
          iconName="settings" // Icône settings
          onPress={() => navigation.navigate("AdvancedSearch")}
        />
        {/* <SearchCard
          title="Search by name"
          description="Find laptops by their model names or brands quickly."
          badgeText="new"
          badgeColor="#ff8307"
          iconColor="#ff8307"
          iconName="search" 
          onPress={() => navigation.navigate('SearchByName')}
        /> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#12122C",
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 40,
    marginBottom: 5,
  },
  subtitle: {
    color: "#A0A0BC",
    marginBottom: 30,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 30,
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E3F",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4A4A6A",
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    paddingVertical: 12,
  },
  clearSearchButton: {
    marginLeft: 8,
    padding: 5,
  },
  searchButton: {
    backgroundColor: "#4953DD",
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  cardsContainer: {},
  card: {
    backgroundColor: "#1E1E3F",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4A4A6A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  cardDescription: {
    color: "#A0A0BC",
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 40, // espace en bas pour bien scroller
  },
});
