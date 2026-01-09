import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ManageUsers() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage users</Text>
      <Text style={styles.subtitle}>Placeholder (à brancher sur ton backend plus tard).</Text>

      <Pressable style={[styles.button, styles.secondary]} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Retour</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 20, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#9ca3af', textAlign: 'center', marginTop: 8, marginBottom: 18 },
  button: {
    marginTop: 12,
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondary: { backgroundColor: '#374151' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
