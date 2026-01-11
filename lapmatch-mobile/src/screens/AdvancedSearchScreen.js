import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import AppButton from "../components/AppButton";
import { fetchExpertRecommendations } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdvancedSearchScreen({ navigation }) {
  // États pour les filtres
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState(16);
  const [budget, setBudget] = useState(15000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const storedCpu = await AsyncStorage.getItem("advancedSearchCpu");
        const storedRam = await AsyncStorage.getItem("advancedSearchRam");
        const storedBudget = await AsyncStorage.getItem("advancedSearchBudget");

        if (storedCpu) setCpu(storedCpu);
        if (storedRam) setRam(Number(storedRam));
        if (storedBudget) setBudget(Number(storedBudget));
      } catch (error) {
        console.error("Erreur lors du chargement des filtres", error);
      }
    };

    loadFilters();
  }, []); // [] → seulement au montage du composant

  useEffect(() => {
    const saveFilters = async () => {
      try {
        await AsyncStorage.setItem("advancedSearchCpu", cpu);
        await AsyncStorage.setItem("advancedSearchRam", ram.toString());
        await AsyncStorage.setItem("advancedSearchBudget", budget.toString());
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des filtres", error);
      }
    };
    saveFilters();
  }, [cpu, ram, budget]); // déclenche à chaque modification

  // États pour la visibilité des Modals
  const [activeModal, setActiveModal] = useState(null); // 'brand', 'cpu', ou 'ram'

  // Options de données
  const cpuOptions = [
    "Intel i5",
    "Intel i7",
    "Intel i9",
    "Ryzen 3",
    "Ryzen 5",
    "Ryzen 7",
  ];

  const normalizeCpu = (cpuLabel) => {
    if (!cpuLabel) return "";
    return cpuLabel
      .toLowerCase()
      .replace("intel ", "")
      .replace("ryzen ", "ryzen ");
  };

  const ramOptions = [8, 16, 32, 64];

  const handleAdvancedSearch = async () => {
    // Empêcher les requêtes multiples
    if (isLoading) {
      console.log("⚠️ Requête déjà en cours, ignore le clic");
      return;
    }

    // Réinitialiser l'erreur
    setError("");
    setIsLoading(true);

    const searchParams = {
      cpu_type: normalizeCpu(cpu),
      gpu_type: "", // optionnel
      ram_gb: ram,
      storage_gb: 512,
      budget: budget,
      screen_size: 15,
      weight: 3,
      eco_level: null,
      offset: 0,
      limit: 7,
    };

    console.log(
      "🔍 [AdvancedSearch] Début de la recherche avec params:",
      searchParams
    );
    const startTime = Date.now();

    try {
      const data = await fetchExpertRecommendations(searchParams);
      const duration = Date.now() - startTime;

      console.log("✅ [AdvancedSearch] Recherche réussie en", duration, "ms");
      console.log(
        "📦 [AdvancedSearch] Données reçues:",
        data?.success ? "Succès" : "Échec",
        "- Nombre de résultats:",
        data?.laptops?.length || 0
      );

      navigation.navigate("Results", {
        results: data.laptops || data.data || [],
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        "❌ [AdvancedSearch] Erreur après",
        duration,
        "ms:",
        error.message
      );
      console.error("❌ [AdvancedSearch] Détails de l'erreur:", error);
      setError(error.message || "Une erreur est survenue lors de la recherche");
    } finally {
      setIsLoading(false);
      console.log("🏁 [AdvancedSearch] Requête terminée");
    }
  };

  // Composant pour les champs de sélection
  const SelectInput = ({ label, value, placeholder, onPress }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.pickerInput} onPress={onPress}>
        <Text style={{ color: value ? "#fff" : "#A0A0BC" }}>
          {value || placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={24} color="#A0A0BC" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Advanced Search</Text>

      {/* Sélection du Processeur */}
      <SelectInput
        label="Processeur"
        value={cpu}
        placeholder="Choisir un CPU"
        onPress={() => setActiveModal("cpu")}
      />

      {/* Sélection de la RAM (Nouveau) */}
      <SelectInput
        label="Mémoire RAM"
        value={`${ram} GB`}
        placeholder="Choisir la capacité"
        onPress={() => setActiveModal("ram")}
      />

      {/* Slider Budget */}
      <Text style={styles.label}>Budget Maximum</Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.valueText}>{budget} dh</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={2000}
          maximumValue={40000}
          step={500}
          minimumTrackTintColor="#4953DD"
          thumbTintColor="#4953DD"
          value={budget}
          onValueChange={setBudget}
        />
        <View style={styles.rangeTextContainer}>
          <Text style={styles.rangeText}>2.000 dh</Text>
          <Text style={styles.rangeText}>40.000 dh</Text>
        </View>
      </View>

      {/* Message d'erreur */}
      {error ? (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={20}
            color="#FF4444"
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.buttonContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4953DD" />
            <Text style={styles.loadingText}>Recherche en cours...</Text>
          </View>
        ) : (
          <AppButton
            title="Voir les résultats"
            onPress={handleAdvancedSearch}
          />
        )}
      </View>

      {/* Modal Unique Dynamique */}
      <SelectionModal
        visible={activeModal !== null}
        setVisible={() => setActiveModal(null)}
        data={
          activeModal === "ram"
            ? ramOptions
            : activeModal === "cpu"
            ? cpuOptions
            : ramOptions
        }
        onSelect={(val) => {
          if (activeModal === "cpu") setCpu(val);
          if (activeModal === "ram") setRam(val);
          setActiveModal(null);
        }}
        title={activeModal?.toUpperCase()}
      />
    </ScrollView>
  );
}

// Composant Modal optimisé
const SelectionModal = ({ visible, setVisible, data, onSelect, title }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => onSelect(item)}
            >
              <Text style={styles.modalItemText}>
                {typeof item === "number" ? `${item} GB` : item}
              </Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={setVisible} style={styles.modalCloseButton}>
          <Text style={styles.modalCloseText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#12122C", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  label: {
    fontSize: 16,
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "600",
  },
  pickerInput: {
    backgroundColor: "#1E1E3F",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4A4A6A",
  },
  sliderContainer: {
    backgroundColor: "#1E1E3F",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#4A4A6A",
  },
  valueText: {
    color: "#4953DD",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  rangeTextContainer: { flexDirection: "row", justifyContent: "space-between" },
  rangeText: { color: "#A0A0BC", fontSize: 12 },
  buttonContainer: { marginTop: 40 },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E1E3F",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4953DD",
  },
  loadingText: {
    color: "#4953DD",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  errorContainer: {
    backgroundColor: "#2D1E1E",
    borderColor: "#FF4444",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    backgroundColor: "#1E1E3F",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    color: "#A0A0BC",
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2D2D50",
  },
  modalItemText: { color: "#fff", fontSize: 18 },
  modalCloseButton: { marginTop: 10, padding: 20, alignItems: "center" },
  modalCloseText: { color: "#4953DD", fontWeight: "bold", fontSize: 16 },
});
