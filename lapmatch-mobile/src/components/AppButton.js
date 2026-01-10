import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function AppButton({ title, onPress }) {
  // On utilise la couleur spécifique de l'image
  const buttonColor = '#4953DD'; 

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: buttonColor }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    // La carte a un padding horizontal de 20, le bouton fait toute la largeur
    paddingVertical: 15,
    borderRadius: 8, // Bords légèrement arrondis
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    // L'image ne montre pas d'ombre forte, mais on peut en ajouter une légère
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  text: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'none', // Pas de majuscules automatiques
  },
});
