import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Laptop } from '@/lib/mock-data';

export function LaptopCard({ laptop, onPress }: { laptop: Laptop; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.brand}>{laptop.brand}</Text>
        <Text style={styles.rating}>{laptop.rating.toFixed(1)}</Text>
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {laptop.name}
      </Text>
      <View style={styles.footerRow}>
        <Text style={styles.price}>${laptop.price.toLocaleString()}</Text>
        <Text style={styles.score}>{laptop.matchScore}% match</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d3748',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rating: {
    color: '#fff',
    fontWeight: '600',
  },
  name: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 24,
  },
  footerRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  score: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
