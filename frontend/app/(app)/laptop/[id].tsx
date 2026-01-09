import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useRecommendations } from '@/context/recommendations';
import { getMockLaptops } from '@/lib/mock-data';

export default function LaptopDetails() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { selectedLaptop } = useRecommendations();

  const laptop = useMemo(() => {
    const id = params.id;
    if (id && selectedLaptop?.id === id) {
      return selectedLaptop;
    }
    if (!id) return null;
    return getMockLaptops().find((l) => l.id === id) ?? null;
  }, [params.id, selectedLaptop]);

  if (!laptop) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Laptop introuvable</Text>
        <Pressable style={[styles.button, styles.secondary]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{laptop.name}</Text>
      <Text style={styles.subtitle}>{laptop.brand}</Text>

      <View style={styles.card}>
        <Row label="Prix" value={`$${laptop.price.toLocaleString()}`} />
        <Row label="CPU" value={laptop.cpu} />
        <Row label="GPU" value={laptop.gpu} />
        <Row label="RAM" value={laptop.ram} />
        <Row label="Stockage" value={laptop.storage} />
        <Row label="Écran" value={laptop.screenSize} />
        <Row label="Poids" value={laptop.weight} />
        <Row label="Note" value={laptop.rating.toFixed(1)} />
      </View>

      <Pressable style={[styles.button, styles.secondary]} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Retour</Text>
      </Pressable>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 20, paddingTop: 48 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#9ca3af', marginTop: 6, marginBottom: 14 },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d3748',
    marginBottom: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 10 },
  rowLabel: { color: '#9ca3af', fontWeight: '700', flex: 1 },
  rowValue: { color: '#fff', flex: 2, textAlign: 'right' },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondary: { backgroundColor: '#374151' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
