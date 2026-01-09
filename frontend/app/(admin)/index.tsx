import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/auth';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin</Text>
      <Text style={styles.subtitle}>{user?.email}</Text>

      <View style={styles.card}>
        <Pressable style={styles.button} onPress={() => router.push('/(admin)/manage-laptops' as any)}>
          <Text style={styles.buttonText}>Gérer laptops</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => router.push('/(admin)/manage-users' as any)}>
          <Text style={styles.buttonText}>Gérer users</Text>
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
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 20, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#9ca3af', textAlign: 'center', marginTop: 8, marginBottom: 18 },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButton: { backgroundColor: '#ef4444' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
