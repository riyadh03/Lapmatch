import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function LaptopCard({ laptop, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: laptop.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>{laptop.brand}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={styles.ratingText}>{laptop.rating}</Text>
          </View>
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {laptop.name}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>${laptop.price.toLocaleString()}</Text>
          <View style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View</Text>
            <Ionicons name="arrow-forward" size={14} color="#4f46e5" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#16213e",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2d3748",
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#0f0f23",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: 12,
    color: "#4f46e5",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 8,
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10b981",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewButtonText: {
    fontSize: 14,
    color: "#4f46e5",
    fontWeight: "500",
  },
})
