"use client"
import { View, Text, StyleSheet } from "react-native"
import Slider from "@react-native-community/slider"

export default function SliderInput({ value, onValueChange, minimumValue, maximumValue, step, formatValue }) {
  return (
    <View style={styles.container}>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{formatValue(value)}</Text>
      </View>

      <Slider
        style={styles.slider}
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor="#4f46e5"
        maximumTrackTintColor="#2d3748"
        thumbTintColor="#4f46e5"
      />

      <View style={styles.labels}>
        <Text style={styles.label}>{formatValue(minimumValue)}</Text>
        <Text style={styles.label}>{formatValue(maximumValue)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2d3748",
  },
  valueContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
  },
})
