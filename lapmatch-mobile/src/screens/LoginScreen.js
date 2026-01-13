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
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import AppButton from "../components/AppButton";
import { loginUser } from "../services/authService";
import { getMe } from "../services/authApi";

export default function LoginScreen({ navigation }) {
  // 🔹 États pour les inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 États pour les erreurs
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // 🔹 Fonction pour gérer le login
  const handleLogin = async () => {
    // Réinitialiser les erreurs
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    let hasError = false;

    // Validation email
    if (!email || !email.trim()) {
      setEmailError("Email requis");
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setEmailError("Format d'email invalide");
        hasError = true;
      }
    }

    // Validation password
    if (!password || !password.trim()) {
      setPasswordError("Mot de passe requis");
      hasError = true;
    }

    if (hasError) return;

    try {
      const userCredential = await loginUser(email.trim(), password);
      console.log("Login successful, UID:", userCredential.user.uid);

      try {
        const me = await getMe();
        console.log("[Login] /auth/me:", me);
        if (me?.is_admin) {
          navigation.navigate("AdminDashboard");
        } else {
          navigation.navigate("Home");
        }
      } catch (meErr) {
        console.log("[Login] ❌ getMe error:", meErr?.message || meErr);
        navigation.navigate("Home");
      }
    } catch (error) {
      console.log("Login error:", error.message || error);

      // Gérer les erreurs Firebase spécifiques
      const errorCode = error.code || "";
      if (errorCode === "auth/user-not-found") {
        setEmailError("Aucun compte trouvé avec cet email");
      } else if (errorCode === "auth/wrong-password") {
        setPasswordError("Mot de passe incorrect");
      } else if (errorCode === "auth/invalid-email") {
        setEmailError("Format d'email invalide");
      } else if (errorCode === "auth/invalid-credential") {
        setGeneralError("Email ou mot de passe incorrect");
      } else {
        setGeneralError(error.message || "Une erreur est survenue");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <FontAwesome name="laptop" size={40} color="#4953DD" />
      </View>

      <Text style={styles.title}>LaptopFinder</Text>
      <Text style={styles.subtitle}>Find your perfect laptop</Text>

      <View>
        <View
          style={[
            styles.inputContainer,
            emailError && styles.inputContainerError,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A0A0BC"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError("");
            }}
          />
          {emailError ? (
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              color="#FF4444"
              style={styles.errorIcon}
            />
          ) : null}
        </View>
        {emailError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{emailError}</Text>
          </View>
        ) : null}
      </View>

      <View>
        <View
          style={[
            styles.inputContainer,
            passwordError && styles.inputContainerError,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A0A0BC"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError("");
            }}
          />
          {passwordError ? (
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              color="#FF4444"
              style={styles.errorIcon}
            />
          ) : null}
        </View>
        {passwordError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{passwordError}</Text>
          </View>
        ) : null}
      </View>

      {generalError ? (
        <View style={styles.generalErrorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={20}
            color="#FF4444"
          />
          <Text style={styles.generalErrorText}>{generalError}</Text>
        </View>
      ) : null}

      <AppButton
        title="Sign In"
        onPress={handleLogin} // 🔹
      />

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <Text
          style={styles.signupLink}
          onPress={() => navigation.navigate("Signup")}
        >
          Sign Up
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: -100, //in case of issues this might be ze problem ಥ_ಥ
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#12122C",
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "transparent",
    borderRadius: 15,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    color: "#4953DD",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#fff",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    color: "#A0A0BC",
    fontSize: 16,
  },
  inputContainer: {
    backgroundColor: "#1E1E3F",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#4A4A6A",
    height: 50,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainerError: {
    borderColor: "#FF4444",
    borderWidth: 1.5,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
  },
  errorIcon: {
    marginLeft: 10,
  },
  errorContainer: {
    marginTop: -4,
    marginBottom: 4,
    marginLeft: 4,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 12,
    marginTop: 2,
  },
  generalErrorContainer: {
    backgroundColor: "#2D1E1E",
    borderColor: "#FF4444",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  generalErrorText: {
    color: "#FF4444",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#A0A0BC",
  },
  signupLink: {
    color: "#4953DD",
    fontWeight: "bold",
    marginLeft: 5,
  }
});
