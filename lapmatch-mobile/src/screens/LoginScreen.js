// // import { View, Text, TextInput, Button } from 'react-native';
// // import AppButton from '../components/AppButton';

// // export default function LoginScreen({ navigation }) {
// //   return (
// //     <View>
// //       <Text>Login</Text>

// //       <TextInput placeholder="Email" />
// //       <TextInput placeholder="Password" secureTextEntry />

// //       <AppButton title="Login" onPress={() => navigation.navigate('Home')} />
// //       <Button title="Don't have an account? Signup" onPress={() => navigation.navigate('Signup')} />
// //     </View>
// //   );
// // }

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import AppButton from '../components/AppButton'; 


export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      
      {/* Utilisation de l'icône 'laptop' dans son conteneur mauve */}
      <View style={styles.logoContainer}>
        {/* 'FontAwesome' est maintenant un composant au lieu de 'Icon' */}
        <FontAwesome name="laptop" size={40} color="#4953DD" /> 
      </View>
      {/* J'ai retiré <View/> et logoPlaceholder qui étaient en conflit */}

      <Text style={styles.title}>LaptopFinder</Text>
      <Text style={styles.subtitle}>Find your perfect laptop</Text>

      {/* Input Email stylisé */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#A0A0BC" 
          keyboardType="email-address"
        />
      </View>
      
      {/* Input Password stylisé */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#A0A0BC" 
          secureTextEntry 
        />
      </View>
      
      <AppButton 
        title="Sign In" 
        onPress={() => navigation.navigate('Home')} 
      />

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?{' '}</Text>
        <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>Sign Up</Text>
      </View>
      
      <View style={styles.demoInfoBox}>
        <Text style={styles.demoText}>Demo: user@test.com / password123</Text>
        <Text style={styles.demoText}>Admin: admin@test.com / admin123</Text>
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
  // Style pour le conteneur mauve avec l'icône centrée
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
  inputContainer: {
    backgroundColor: '#1E1E3F', 
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 8, 
    borderWidth: 1,
    borderColor: '#4A4A6A',
    height: 50, 
    justifyContent: 'center',
  },
  input: {
    color: '#FFFFFF', 
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#A0A0BC',
  },
  signupLink: {
    color: '#4953DD', 
    fontWeight: 'bold',
    marginLeft: 5,
  },
  demoInfoBox: {
    backgroundColor: '#1E1E3F',
    borderRadius: 8,
    padding: 15,
    marginTop: 30,
    alignSelf: 'stretch',
  },
  demoText: {
    color: '#A0A0BC',
    fontSize: 12,
    lineHeight: 18,
  }
});
