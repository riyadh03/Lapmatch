import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useRecommendations } from '@/context/recommendations';
import { getMockRecommendations } from '@/lib/mock-data';
import { SelectInput, type SelectOption } from '@/components/select-input';

export default function NonExpertForm() {
  const router = useRouter();
  const { setRecommendations } = useRecommendations();

  const [usage, setUsage] = useState<string | null>(null);
  const [budget, setBudget] = useState<string>('1500');

  const options: SelectOption[] = useMemo(
    () => [
      { label: 'Études', value: 'student' },
      { label: 'Bureautique', value: 'office' },
      { label: 'Gaming', value: 'gaming' },
      { label: 'Développement', value: 'development' },
      { label: 'Design', value: 'design' },
      { label: 'Création contenu', value: 'content' },
    ],
    []
  );

  const onSubmit = () => {
    const parsed = Number(budget);
    const safeBudget = Number.isFinite(parsed) && parsed > 0 ? parsed : 1500;
    const safeUsage = usage ?? 'office';

    const recos = getMockRecommendations(safeUsage, safeBudget);
    setRecommendations(recos);
    router.push('/(app)/recommendations' as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mode non-expert</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Usage</Text>
        <SelectInput options={options} value={usage} onValueChange={setUsage} placeholder="Choisir l'usage" />

        <Text style={[styles.label, { marginTop: 12 }]}>Budget (€)</Text>
        <TextInput
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          placeholder="1500"
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
