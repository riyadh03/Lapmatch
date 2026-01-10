import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LogoutScreen() {
  const navigation = useNavigation();

  const handleGoLogin = () => {
    navigation.navigate('HomeTab', { screen: 'Login' });
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Oui',
          onPress: () => {
            // Redirection vers Login
            handleGoLogin();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Vous allez vous déconnecter</Text>
      <Button
        title="Se déconnecter"
        onPress={handleLogout}
        color="#E53935"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#12122C', padding: 20 },
  text: { color: '#fff', fontSize: 18, marginBottom: 20, textAlign: 'center' },
});
