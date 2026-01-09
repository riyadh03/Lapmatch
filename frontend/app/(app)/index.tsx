import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/auth';

export default function AppHome() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lapmatch</Text>
      <Text style={styles.subtitle}>Bienvenue {user?.email}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Choisis ton mode</Text>

        <Pressable style={styles.button} onPress={() => router.push('/(app)/non-expert' as any)}>
          <Text style={styles.buttonText}>Non-expert (simple)</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.buttonSecondary]} onPress={() => router.push('/(app)/expert' as any)}>
          <Text style={styles.buttonText}>Expert (avancé)</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.logoutButton]}
          onPress={async () => {
            await logout();
            router.replace('/' as any);
          }}>
          <Text style={styles.buttonText}>Se déconnecter</Text>
        </Pressable>
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
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonSecondary: {
    backgroundColor: '#4338ca',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
