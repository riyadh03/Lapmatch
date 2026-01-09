import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/context/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setError(null);
      setLoading(true);
      await login(email.trim(), password);
      router.replace('/' as any);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lapmatch</Text>
      <Text style={styles.subtitle}>Connecte-toi</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
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
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Se connecter</Text>}
        </Pressable>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Pas de compte ?</Text>
          <Link href={'/(auth)/signup' as any} asChild>
            <Pressable>
              <Text style={styles.link}>Créer un compte</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.hint}>
          <Text style={styles.hintText}>Test:</Text>
          <Text style={styles.hintText}>user@test.com / password123</Text>
          <Text style={styles.hintText}>admin@test.com / admin123</Text>
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
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
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
  hint: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0f0f23',
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  hintText: {
    color: '#9ca3af',
    fontSize: 12,
  },
});
