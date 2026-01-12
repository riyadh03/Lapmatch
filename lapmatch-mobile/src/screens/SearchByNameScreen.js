import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchSearchByName } from "../services/api";

export default function SearchByNameScreen({ navigation }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      Alert.alert(
        "Terme de recherche trop court",
        "Veuillez saisir au moins 2 caractères pour effectuer une recherche."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("[SearchByName] 🔍 Recherche de:", searchTerm);
      const response = await fetchSearchByName(searchTerm.trim());

      console.log(
        "[SearchByName] ✅ Résultats reçus:",
        response?.data?.length || 0
      );

      if (response?.success && response?.data) {
        navigation.navigate("Results", {
          results: response.data,
        });
      } else {
        setError("Aucun résultat trouvé pour cette recherche.");
      }
    } catch (err) {
      console.error("[SearchByName] ❌ Erreur:", err.message);
      setError(err.message || "Une erreur est survenue lors de la recherche.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Rechercher un laptop</Text>
        <Text style={styles.subtitle}>
          Recherchez par nom de marque ou de modèle. Les fautes de frappe sont
          tolérées.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#A0A0BC"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Ex: Lenovo, MacBook Pro, Dell XPS..."
            placeholderTextColor="#6A6A8A"
            value={searchTerm}
            onChangeText={(text) => {
              setSearchTerm(text);
              setError(null);
            }}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchTerm("");
                setError(null);
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#A0A0BC" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.searchButton,
            isLoading && styles.searchButtonDisabled,
          ]}
          onPress={handleSearch}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.searchButtonText}>Rechercher</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            </>
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!isLoading && !error && searchTerm.length === 0 && (
        <View style={styles.hintContainer}>
          <Ionicons name="information-circle" size={24} color="#4953DD" />
          <Text style={styles.hintText}>
            Saisissez le nom d'une marque ou d'un modèle de laptop.
            {"\n"}
            Exemples: "Lenovo", "MacBook", "Dell XPS", "Asus ROG"
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12122C",
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#A0A0BC",
    lineHeight: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E3F",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4A4A6A",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 15,
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4953DD",
    paddingVertical: 16,
    borderRadius: 12,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A1E1E",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff6b6b",
    marginBottom: 20,
  },
  errorText: {
    color: "#ff6b6b",
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#1E1E3F",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4953DD",
    marginTop: 20,
  },
  hintText: {
    color: "#A0A0BC",
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
