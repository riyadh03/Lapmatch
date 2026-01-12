import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import AppButton from "../components/AppButton";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { signupUser } from "../services/authService";

export default function SignupScreen({ navigation }) {
  // 🔹 States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔹 États pour les erreurs
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // 🔹 Signup handler
  const handleSignup = async () => {
    // Réinitialiser les erreurs
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
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
    } else if (password.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      hasError = true;
    }

    // Validation confirm password
    if (!confirmPassword || !confirmPassword.trim()) {
      setConfirmPasswordError("Veuillez confirmer votre mot de passe");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas");
      hasError = true;
    }

    if (hasError) return;

    try {
      const userCredential = await signupUser(email.trim(), password);
      console.log("Signup successful");
      console.log("UID:", userCredential.user.uid);

      Alert.alert("Signup successful", `UID: ${userCredential.user.uid}`);

      // ➜ Plus tard : envoyer UID + fullName au backend
      navigation.navigate("Home");
    } catch (error) {
      console.log("Signup error:", error.message);

      // Gérer les erreurs Firebase spécifiques
      const errorCode = error.code || "";
      if (errorCode === "auth/email-already-in-use") {
        setEmailError("Cet email est déjà utilisé");
      } else if (errorCode === "auth/invalid-email") {
        setEmailError("Format d'email invalide");
      } else if (errorCode === "auth/weak-password") {
        setPasswordError("Le mot de passe est trop faible");
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

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join LaptopFinder today</Text>

      <View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#A0A0BC"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
      </View>

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
              // Réinitialiser l'erreur de confirmation si on change le password
              if (confirmPasswordError && text === confirmPassword) {
                setConfirmPasswordError("");
              }
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

      <View>
        <View
          style={[
            styles.inputContainer,
            confirmPasswordError && styles.inputContainerError,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#A0A0BC"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) {
                if (text === password) {
                  setConfirmPasswordError("");
                } else if (text.length > 0) {
                  setConfirmPasswordError(
                    "Les mots de passe ne correspondent pas"
                  );
                } else {
                  setConfirmPasswordError("");
                }
              }
            }}
          />
          {confirmPasswordError ? (
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              color="#FF4444"
              style={styles.errorIcon}
            />
          ) : null}
        </View>
        {confirmPasswordError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
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

      <AppButton title="Create Account" onPress={handleSignup} />

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <Text
          style={styles.loginLink}
          onPress={() => navigation.goBack("Login")}
        >
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#A0A0BC",
  },
  loginLink: {
    color: "#4953DD",
    fontWeight: "bold",
    marginLeft: 5,
  },
  inputContainer: {
    backgroundColor: "#1E1E3F",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#4A4A6A",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
});
