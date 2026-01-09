import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { getMockLaptops } from '@/lib/mock-data';

export default function ManageLaptops() {
  const router = useRouter();
  const laptops = getMockLaptops();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage laptops</Text>

      <FlatList
        data={laptops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price.toLocaleString()}</Text>
          </View>
        )}
      />

      <Pressable style={[styles.button, styles.secondary]} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Retour</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 20, paddingTop: 48 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 12 },
  row: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2d3748',
    marginBottom: 10,
  },
  name: { color: '#fff', fontWeight: '700' },
  price: { color: '#9ca3af', marginTop: 6 },
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
