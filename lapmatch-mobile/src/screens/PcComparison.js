// import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
// import { useState } from 'react';

// export default function AdvancedSearchScreen({ navigation }) {
//   const [usage, setUsage] = useState('');
//   const [budget, setBudget] = useState('');
//   const [ram, setRam] = useState('');
//   const [storage, setStorage] = useState('');

//   const handleSearch = () => {
//     navigation.navigate('Results', {
//       searchData: {
//         usage,
//         budget,
//         ram,
//         storage
//       }
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Recherche avancée</Text>

//       <TextInput
//         placeholder="Usage (gaming, study, dev...)"
//         value={usage}
//         onChangeText={setUsage}
//         style={styles.input}
//       />

//       <TextInput
//         placeholder="Budget (MAD)"
//         value={budget}
//         onChangeText={setBudget}
//         keyboardType="numeric"
//         style={styles.input}
//       />

//       <TextInput
//         placeholder="RAM (GB)"
//         value={ram}
//         onChangeText={setRam}
//         keyboardType="numeric"
//         style={styles.input}
//       />

//       <TextInput
//         placeholder="Stockage (GB)"
//         value={storage}
//         onChangeText={setStorage}
//         keyboardType="numeric"
//         style={styles.input}
//       />

//       <Button title="Search" onPress={handleSearch} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20
//   },
//   title: {
//     fontSize: 22,
//     marginBottom: 15
//   },
//   input: {
//     borderWidth: 1,
//     padding: 10,
//     marginBottom: 15,
//     borderRadius: 5
//   }
// });
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import AppButton from '../components/AppButton';

export default function PcComparisonScreen({ navigation }) {
  // États pour les filtres
  const [ram, setRam] = useState('');
  const [processor, setProcessor] = useState('');
  const [brand, setBrand] = useState('');
  const [budget, setBudget] = useState(10000);
  
  // États pour la visibilité des Modals
  const [activeModal, setActiveModal] = useState(null); // 'brand', 'cpu', ou 'ram'

  // Options de données
  const brandOptions = ['Apple', 'Asus', 'HP', 'Dell', 'Lenovo', 'MSI', 'Acer', 'Razer'];
  const cpuOptions = ['Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1/M2/M3'];
  const ramOptions = ['4 GB', '8 GB', '16 GB', '32 GB', '64 GB'];

  const handleAdvancedSearch = () => {
    const advancedData = { ram, processor, brand, budget };
    console.log("Advanced search:", advancedData);
    navigation.navigate('Results', { searchData: advancedData });
  };

  // Composant pour les champs de sélection
  const SelectInput = ({ label, value, placeholder, onPress }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.pickerInput} onPress={onPress}>
        <Text style={{ color: value ? '#fff' : '#A0A0BC' }}>
          {value || placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={24} color="#A0A0BC" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Pc Comparison</Text>

      {/* Sélection de la Marque 
      <SelectInput 
        label="Marque préférée" 
        value={brand} 
        placeholder="Choisir une marque" 
        onPress={() => setActiveModal('brand')} 
      />*/}

      {/* Sélection du Processeur 
      <SelectInput 
        label="Processeur" 
        value={processor} 
        placeholder="Choisir un CPU" 
        onPress={() => setActiveModal('cpu')} 
      />*/}

      {/* Sélection de la RAM (Nouveau)
      <SelectInput 
        label="Mémoire RAM" 
        value={ram} 
        placeholder="Choisir la capacité" 
        onPress={() => setActiveModal('ram')} 
      /> */}

      {/* Slider Budget 
      <Text style={styles.label}>Budget Maximum</Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.valueText}>{budget} dh</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
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

      <View style={styles.buttonContainer}>
        <AppButton title="Voir les résultats" onPress={handleAdvancedSearch} />
      </View>
      */}

      {/* Modal Unique Dynamique
      <SelectionModal 
        visible={activeModal !== null} 
        setVisible={() => setActiveModal(null)} 
        data={
          activeModal === 'brand' ? brandOptions : 
          activeModal === 'cpu' ? cpuOptions : 
          ramOptions
        } 
        onSelect={(val) => {
          if(activeModal === 'brand') setBrand(val);
          if(activeModal === 'cpu') setProcessor(val);
          if(activeModal === 'ram') setRam(val);
          setActiveModal(null);
        }}
        title={activeModal?.toUpperCase()}
      />*/}
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
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.modalItem} onPress={() => onSelect(item)}>
              <Text style={styles.modalItemText}>{item}</Text>
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
    container: { 
    flex: 1,     
    backgroundColor: '#12122C',
    padding: 20 
  },
    title: { 
      fontSize: 24, 
      fontWeight: 'bold', 
      color: '#fff', 
      marginBottom: 10 
    },
  label: { 
    fontSize: 16, 
    color: '#fff', 
    marginTop: 20, 
    marginBottom: 10, 
    fontWeight: '600' 
  },
  pickerInput: {
    backgroundColor: '#1E1E3F',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A4A6A'
  },
  sliderContainer: { backgroundColor: '#1E1E3F', borderRadius: 12, padding: 15, borderWidth: 1, borderColor: '#4A4A6A' },
  valueText: { color: '#4953DD', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  rangeTextContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  rangeText: { color: '#A0A0BC', fontSize: 12 },
  buttonContainer: { marginTop: 40 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { backgroundColor: '#1E1E3F', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, maxHeight: '70%' },
  modalTitle: { color: '#A0A0BC', fontSize: 14, marginBottom: 15, textAlign: 'center', fontWeight: 'bold' },
  modalItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#2D2D50' },
  modalItemText: { color: '#fff', fontSize: 18 },
  modalCloseButton: { marginTop: 10, padding: 20, alignItems: 'center' },
  modalCloseText: { color: '#4953DD', fontWeight: 'bold', fontSize: 16 }
});
