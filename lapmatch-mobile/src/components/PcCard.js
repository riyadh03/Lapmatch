// PcCard.js
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from './AppButton';

const PcCard = ({ pc, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Image du PC */}
      <Image
        source={{ uri: pc.image_url || "https://via.placeholder.com/300x200" }}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Icône Favori */}
      <TouchableOpacity style={styles.favoriteIcon} onPress={toggleFavorite}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={isFavorite ? "red" : "white"}
        />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        {/* Header : rating */}
        <View style={styles.headerRow}>
          {pc.rating !== null && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#f1c40f" />
              <Text style={styles.ratingText}>{pc.rating}</Text>
            </View>
          )}
        </View>

        {/* Nom du PC */}
        <Text style={styles.nameText}>{pc.name}</Text>

        {/* Specs rapides */}
        {pc.cpu && <Text style={styles.specText}>CPU: {pc.cpu}</Text>}
        {pc.gpu && <Text style={styles.specText}>GPU: {pc.gpu}</Text>}
        {pc.ram_gb && <Text style={styles.specText}>RAM: {pc.ram_gb} GB</Text>}
        {pc.storage_gb && <Text style={styles.specText}>Storage: {pc.storage_gb} GB</Text>}

        {/* Footer : prix + bouton */}
        <View style={styles.footerRow}>
          <Text style={styles.priceText}>{pc.price?.toLocaleString()} MAD</Text>
          {pc.external_link && (
            <AppButton
              title="Acheter"
              onPress={() => Linking.openURL(pc.external_link)}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#353a7c',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'relative', // pour que l'icône absolue soit relative à la carte
  },
  image: {
    width: '100%',
    height: 150,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  infoContainer: {
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e273b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    color: '#ecf0f1',
    fontSize: 12,
    fontWeight: 'bold',
  },
  nameText: {
    color: '#ecf0f1',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  specText: {
    color: '#ecf0f1',
    fontSize: 14,
    marginBottom: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  priceText: {
    color: '#2ecc71',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default PcCard;
