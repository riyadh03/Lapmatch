// component for the pc card
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Assuming you have expo vector icons installed
import AppButton from './AppButton';
import { Linking } from 'react-native';

const PcCard = ({ pc, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{
          uri: pc.image_url || "https://via.placeholder.com/300x200",
        }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.infoContainer}>
        {/* Header : rating uniquement */}
        <View style={styles.headerRow}>
          {pc.rating !== null && (
            <View style={styles.ratingContainer}>
              <AntDesign name="star" size={14} color="#f1c40f" />
              <Text style={styles.ratingText}>{pc.rating}</Text>
            </View>
          )}
        </View>

        {/* Nom */}
        <Text style={styles.nameText}>{pc.name}</Text>

        {/* Specs */}
        {pc.cpu && <Text style={styles.specText}>CPU: {pc.cpu}</Text>}
        {pc.gpu && <Text style={styles.specText}>GPU: {pc.gpu}</Text>}
        {pc.ram_gb && <Text style={styles.specText}>RAM: {pc.ram_gb} GB</Text>}
        {pc.storage_gb && <Text style={styles.specText}>Storage: {pc.storage_gb} GB</Text>}

        {/* Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.priceText}>
            {pc.price?.toLocaleString()} MAD
          </Text>

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
    backgroundColor: '#353a7c', // The dark blue background of the cards
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: 150, // Image height within the card
  },
  infoContainer: {
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandText: {
    color: '#7f8c8d', // Greyish text for brand name
    fontSize: 14,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e273b', // Background for rating badge
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
    color: '#ecf0f1', // White/Off-white for the main laptop name
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    color: '#2ecc71', // Green color for the price
    fontSize: 22,
    fontWeight: 'bold',
  },
  viewButton: {
    // The "View →" text itself acts like a button link in the image
  },
  viewText: {
    color: '#7f8c8d', // Grey color for the view link
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PcCard;
