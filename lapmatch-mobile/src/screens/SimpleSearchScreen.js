import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import AppButton from '../components/AppButton';
import { fetchNonExpertRecommendations } from "../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Composant interne pour les cartes "Usage" ---
const UsageCard = ({ title, isActive, onPress, iconName }) => (
  <TouchableOpacity 
    style={[styles.usageCard, isActive && styles.usageCardActive]} 
    onPress={onPress}
  >
    <View style={styles.iconPlaceholder}>
      <MaterialCommunityIcons 
        name={iconName}
        size={24} 
        color={isActive ? '#fff' : '#4953DD'} 
      />
    </View>
    <Text style={[styles.usageText, isActive && styles.usageTextActive]}>{title}</Text>
  </TouchableOpacity>
);

export default function SimpleSearchScreen({ navigation }) {
  const [usage, setUsage] = useState('Development'); 
  const [storage, setStorage] = useState(''); 
  const [budget, setBudget] = useState(1500); 
  const [rating, setRating] = useState(4.0); 
  const [modalVisible, setModalVisible] = useState(false);

  
  const STORAGE_MAP = {
    "256GB": 256,
    "512GB": 512,
    "1TB": 1024,
    "2TB": 2048,
  };

  const storageOptions = [
    { label: "256GB", value: "256GB" },
    { label: "512GB", value: "512GB" },
    { label: "1TB", value: "1TB" },
    { label: "2TB", value: "2TB" },
  ];

  const USAGE_MAP = {
    Gaming: "GAMING",
    Development: "DEVELOPPEMENT",
    Design: "GRAPHISME",
    Personal: "ETUDES",
  };
  
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const savedUsage = await AsyncStorage.getItem('simpleSearchUsage');
        const savedStorage = await AsyncStorage.getItem('simpleSearchStorage');
        const savedBudget = await AsyncStorage.getItem('simpleSearchBudget');
        const savedRating = await AsyncStorage.getItem('simpleSearchRating');

        if (savedUsage) setUsage(savedUsage);
        if (savedStorage) setStorage(savedStorage);
        if (savedBudget) setBudget(Number(savedBudget));
        if (savedRating) setRating(Number(savedRating));
      } catch (err) {
        console.error("Erreur chargement filtres:", err);
      }
    };

    loadFilters();
  }, []);

  useEffect(() => {
    const saveFilters = async () => {
      try {
        await AsyncStorage.setItem('simpleSearchUsage', usage);
        await AsyncStorage.setItem('simpleSearchStorage', storage);
        await AsyncStorage.setItem('simpleSearchBudget', budget.toString());
        await AsyncStorage.setItem('simpleSearchRating', rating.toString());
      } catch (err) {
        console.error("Erreur sauvegarde filtres:", err);
      }
    };

    saveFilters();
  }, [usage, storage, budget, rating]);


  const handleSearch = async () => {
    try {
      const data = await fetchNonExpertRecommendations({
        usage_name: USAGE_MAP[usage],   // ex: "GAMING", "ETUDES"
        max_price: budget,
        min_rating: rating,
        storage_gb: STORAGE_MAP[storage] || 0,               // ex: "512GB"
        offset: 0,
        limit: 7,
      });

      // Navigation vers l'écran Results avec les données reçues
      navigation.navigate("Results", { results: data });
    } catch (error) {
      console.error("Erreur lors de la recherche:", error.message);
    }
  };


  return (
    <ScrollView style={styles.container}>
      
      {/* Section Usage */}
      <View>
        <View style={styles.cardRow}>
          <UsageCard 
            title="Développement"
            iconName="code-tags"
            isActive={usage === 'Development'}
            onPress={() => setUsage('Development')}
          />
          <UsageCard 
            title="Graphisme"
            iconName="palette"
            isActive={usage === 'Design'}
            onPress={() => setUsage('Design')}
          />
        </View>
        <View style={styles.cardRow}>
          <UsageCard 
            title="Gaming"
            iconName="gamepad-variant"
            isActive={usage === 'Gaming'}
            onPress={() => setUsage('Gaming')}
          />
          <UsageCard 
            title="Personnel/Etudes"
            iconName="account"
            isActive={usage === 'Personal'}
            onPress={() => setUsage('Personal')}
          />
        </View>
      </View>

      {/* Section Budget */}
      <Text style={styles.label}>Budget</Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.budgetValue}>{budget} dh</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={500}
          maximumValue={5000}
          step={500}
          minimumTrackTintColor="#4953DD"
          maximumTrackTintColor="#4A4A6A"
          thumbTintColor="#4953DD"
          value={budget}
          onValueChange={(value) => setBudget(value)}
        />
        <View style={styles.rangeTextContainer}>
          <Text style={styles.rangeText}>500 dh</Text>
          <Text style={styles.rangeText}>5.000 dh</Text>
        </View>
      </View>

      {/* Section Storage */}
      <Text style={styles.label}>Minimum Storage</Text>
      <TouchableOpacity 
        style={styles.pickerInput}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: storage ? '#fff' : '#A0A0BC' }}>
          {storage ? storageOptions.find(opt => opt.value === storage)?.label : 'Select storage'}
        </Text>
        <MaterialCommunityIcons 
          name="chevron-down" 
          size={24} 
          color="#A0A0BC" 
        />
      </TouchableOpacity>

      {/* Modal pour le storage */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={storageOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setStorage(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Section Minimum Rating */}
      <Text style={styles.label}>Minimum Rating</Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={3.0}
          maximumValue={5.0}
          step={0.1}
          minimumTrackTintColor="#4953DD"
          maximumTrackTintColor="#4A4A6A"
          thumbTintColor="#4953DD"
          value={rating}
          onValueChange={(value) => setRating(value)}
        />
        <View style={styles.rangeTextContainer}>
          <Text style={styles.rangeText}>3.0</Text>
          <Text style={styles.rangeText}>5.0</Text>
        </View>
      </View>

      {/* Bouton Recherche */}
      <View style={styles.buttonContainer}>
        <AppButton title="Find Laptops" onPress={handleSearch} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#12122C',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
    marginBottom: 10,
  },
  usageCard: {
    backgroundColor: '#1E1E3F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  usageCardActive: {
    backgroundColor: '#4953DD',
  },
  iconPlaceholder: {
    marginBottom: 10,
  },
  usageText: {
    color: '#A0A0BC',
    fontSize: 12,
  },
  usageTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pickerInput: {
    backgroundColor: '#1E1E3F',
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A4A6A',
    fontSize: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderContainer: {
    backgroundColor: '#1E1E3F',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#4A4A6A',
    marginBottom: 10,
  },
  budgetValue: {
    color: '#4953DD',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingValue: {
    color: '#4953DD',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rangeTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    color: '#A0A0BC',
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 30,
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1E1E3F',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A6A',
  },
  modalItemText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCloseButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseText: {
    color: '#4953DD',
    fontSize: 16,
    fontWeight: 'bold',
  },
});