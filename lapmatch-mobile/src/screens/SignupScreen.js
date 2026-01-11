import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import { FontAwesome } from "@expo/vector-icons";
import { signupUser } from "../services/authService";

export default function SignupScreen({ navigation }) {
  // 🔹 States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔹 Signup handler
  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      console.log("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    try {
      const userCredential = await signupUser(email, password);
      console.log("Signup successful");
      console.log("UID:", userCredential.user.uid);

      Alert.alert("Signup successful", `UID: ${userCredential.user.uid}`);

      // ➜ Plus tard : envoyer UID + fullName au backend
      navigation.navigate("Home");
    } catch (error) {
      console.log("Signup error:", error.message);
      Alert.alert("Signup error", error.message || String(error));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <FontAwesome name="laptop" size={40} color="#4953DD" />
      </View>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join LaptopFinder today</Text>

      <AppInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <AppInput
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <AppInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <AppInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <AppButton title="Create Account" onPress={handleSignup} />

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
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
});
