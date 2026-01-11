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
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import AppButton from '../components/AppButton'; 
import { loginUser } from '../services/authService';

export default function LoginScreen({ navigation }) {

  // 🔹 États pour les inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🔹 Fonction pour gérer le login
  const handleLogin = async () => {
    // Validation basique
    if (!email || !email.trim()) {
      console.log("Email requis");
      return;
    }
    
    if (!password || !password.trim()) {
      console.log("Mot de passe requis");
      return;
    }

    // Validation format email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.log("Format d'email invalide");
      return;
    }

    try {
      const userCredential = await loginUser(email.trim(), password);
      console.log("Login successful, UID:", userCredential.user.uid);
      navigation.navigate('Home');
    } catch (error) {
      console.log("Login error:", error.message || error);
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.logoContainer}>
        <FontAwesome name="laptop" size={40} color="#4953DD" /> 
      </View>

      <Text style={styles.title}>LaptopFinder</Text>
      <Text style={styles.subtitle}>Find your perfect laptop</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#A0A0BC" 
          keyboardType="email-address"
          value={email}               // 🔹
          onChangeText={setEmail}     // 🔹
        />
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#A0A0BC" 
          secureTextEntry 
          value={password}            // 🔹
          onChangeText={setPassword}  // 🔹
        />
      </View>
      
      <AppButton 
        title="Sign In" 
        onPress={handleLogin} // 🔹
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
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'transparent',
    borderRadius: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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
