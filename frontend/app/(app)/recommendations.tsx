import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { LaptopCard } from '@/components/laptop-card';
import { useRecommendations } from '@/context/recommendations';

export default function RecommendationsScreen() {
  const router = useRouter();
  const { recommendations, setSelectedLaptop } = useRecommendations();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommandations</Text>

      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <LaptopCard
            laptop={item}
            onPress={() => {
              setSelectedLaptop(item);
              router.push(`/(app)/laptop/${item.id}` as any);
            }}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucune recommandation. Retourne au formulaire.</Text>}
      />

      <View style={styles.footer}>
        <Pressable style={[styles.button, styles.secondary]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Retour</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 20, paddingTop: 48 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 12 },
  empty: { color: '#9ca3af', marginTop: 16 },
  footer: { paddingTop: 12 },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondary: { backgroundColor: '#374151' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
