import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';

export default function SearchByNameScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleSearch = () => {
    navigation.navigate('Results', {
      searchType: 'name',//!
      searchData: { name }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter the laptop name</Text>

      <AppInput style={styles.subtitle}
        placeholder="Ex: MacBook Pro, Dell XPS..."
        value={name}
        onChangeText={setName}
      />

      <AppButton title="Rechercher" onPress={handleSearch} />
    </View>
  );
}

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
});


