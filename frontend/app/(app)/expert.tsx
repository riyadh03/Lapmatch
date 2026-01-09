import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useRecommendations } from '@/context/recommendations';
import { getMockRecommendations } from '@/lib/mock-data';

export default function ExpertForm() {
  const router = useRouter();
  const { setRecommendations } = useRecommendations();

  const [budget, setBudget] = useState<string>('2000');

  const onSubmit = () => {
    const parsed = Number(budget);
    const safeBudget = Number.isFinite(parsed) && parsed > 0 ? parsed : 2000;

    const recos = getMockRecommendations('expert', safeBudget);
    setRecommendations(recos);
    router.push('/(app)/recommendations' as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mode expert</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Budget (€)</Text>
        <TextInput
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          placeholder="2000"
          placeholderTextColor="#6b7280"
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Voir recommandations</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.secondary]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Retour</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 20, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 18 },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  label: { color: '#e5e7eb', marginBottom: 8, fontWeight: '600' },
  input: {
    backgroundColor: '#0f0f23',
    borderColor: '#2d3748',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: '#fff',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondary: { backgroundColor: '#374151' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
