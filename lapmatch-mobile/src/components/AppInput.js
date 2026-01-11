
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
// Note : Les icônes devront être ajoutées manuellement si vous installez une bibliothèque d'icônes
// Exemple : import { User, Mail, Lock } from 'lucide-react-native'; 

export default function AppInput({ placeholder, secureTextEntry, keyboardType, icon: IconComponent, value, onChangeText, style, ...rest }) {
  return (
    <View style={[styles.inputContainer, style]}>
      {/* {IconComponent && <IconComponent style={styles.icon} size={20} />} */}
      <TextInput 
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#A0A0BC"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row', // Alignement horizontal
    alignItems: 'center',
    backgroundColor: '#1E1E3F', // Le fond des inputs dans l'image
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 8, // Espace entre les champs
    borderWidth: 1,
    borderColor: '#4A4A6A',
    height: 50,
  },
  icon: {
    marginRight: 10,
    color: '#6200EE', // Le violet de l'image
  },
  input: {
    flex: 1, 
    color: '#FFFFFF', // Texte saisi en blanc
    fontSize: 16,
  },
});
