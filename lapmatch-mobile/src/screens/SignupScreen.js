import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput'; // Import du nouvel input
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'; 

export default function SignupScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <FontAwesome name="laptop" size={40} color="#4953DD" /> 
      </View>
     

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join LaptopFinder today</Text>

      {/* Utilisation de AppInput */}
      <AppInput placeholder="Full Name" />
      <AppInput placeholder="Email" keyboardType="email-address" />
      <AppInput placeholder="Password" secureTextEntry />
      <AppInput placeholder="Confirm Password" secureTextEntry />
      
      {/* Utilisation de AppButton (violet par défaut) */}
      <AppButton 
        title="Create Account" 
        onPress={() => navigation.navigate('Home')} 
      />
      
      {/* Le lien "Sign In" en bas */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          Already have an account? 
        </Text>
        <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          Sign In
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#12122C', 
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'transparent', // Le violet de l'image
    borderRadius: 15,
    alignSelf: 'center', // Centre le bloc horizontalement
    justifyContent: 'center', // Centre l'icône verticalement
    alignItems: 'center', // Centre l'icône horizontalement
    marginBottom: 20,
    color: '#4953DD',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#fff',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#A0A0BC',
    fontSize: 16,

  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#A0A0BC',
  },
  loginLink: {
    color: '#4953DD', 
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
