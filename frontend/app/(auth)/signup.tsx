import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/context/auth';

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setError(null);
      setLoading(true);
      await signup(email.trim(), password, name.trim());
      router.replace('/' as any);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ton nom"
          placeholderTextColor="#6b7280"
          style={styles.input}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor="#6b7280"
          style={styles.input}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Mot de passe</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="********"
          placeholderTextColor="#6b7280"
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>S’inscrire</Text>}
        </Pressable>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Déjà un compte ?</Text>
          <Link href={'/(auth)/login' as any} asChild>
            <Pressable>
              <Text style={styles.link}>Se connecter</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  label: {
    color: '#e5e7eb',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0f0f23',
    borderColor: '#2d3748',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: '#fff',
  },
  error: {
    color: '#ef4444',
    marginTop: 12,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  footerRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    color: '#9ca3af',
  },
  link: {
    color: '#a5b4fc',
    fontWeight: '700',
  },
});
