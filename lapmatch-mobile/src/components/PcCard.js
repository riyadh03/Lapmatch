// PcCard.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { favoritesService } from "../services/favoritesService";

const PcCard = ({ pc, onPress, isFavoriteInitial = false, onFavoriteChange, style }) => {
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);

  useEffect(() => {
    setIsFavorite(isFavoriteInitial);
  }, [isFavoriteInitial]);

  const toggleFavorite = async () => {
    const newFavoriteState = await favoritesService.toggleFavorite(pc);
    setIsFavorite(newFavoriteState);

    if (onFavoriteChange) {
      onFavoriteChange(pc, newFavoriteState);
    }
  };

  // Fonction pour tronquer le nom si trop long
  const getShortName = (name) => {
    if (!name) return "Laptop";
    const maxLength = 40; // Longueur maximale du nom
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  // Fonction pour afficher les étoiles de rating
  const renderStars = (rating) => {
    if (!rating || rating === null) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#f1c40f" />);
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#f1c40f" />
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={16}
          color="#f1c40f"
        />
      );
    }
    return stars;
  };

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.7}>
      {/* Image du PC */}
      <Image
        source={{
          uri:
            pc.image_url || pc.image || "https://via.placeholder.com/300x200",
        }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Icône Favori */}
      <TouchableOpacity
        style={styles.favoriteIcon}
        onPress={toggleFavorite}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={22}
          color={isFavorite ? "#FF4444" : "#fff"}
        />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        {/* Nom du PC (tronqué) */}
        <Text style={styles.nameText} numberOfLines={2}>
          {getShortName(pc.name)}
        </Text>

        {/* Rating avec étoiles */}
        {pc.rating !== null && pc.rating !== undefined && (
          <View style={styles.ratingRow}>
            <View style={styles.starsContainer}>{renderStars(pc.rating)}</View>
            <Text style={styles.ratingText}>{pc.rating?.toFixed(1)}</Text>
          </View>
        )}

        {/* Footer : prix + bouton View */}
        <View style={styles.footerRow}>
          <Text style={styles.priceText}>
            {pc.price
              ? `${pc.price.toLocaleString()} dh`
              : "Prix non disponible"}
          </Text>
          <TouchableOpacity style={styles.viewButton} onPress={onPress}>
            <Text style={styles.viewButtonText}>View</Text>
            <Ionicons name="chevron-forward" size={16} color="#4953DD" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1E1E3F",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: "#2A2A4A",
  },
  favoriteIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 8,
  },
  infoContainer: {
    padding: 15,
  },
  nameText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 22,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    color: "#A0A0BC",
    fontSize: 14,
    fontWeight: "500",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  priceText: {
    color: "#4953DD",
    fontSize: 20,
    fontWeight: "bold",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4953DD",
  },
  viewButtonText: {
    color: "#4953DD",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
});

export default PcCard;
