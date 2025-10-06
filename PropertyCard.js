import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function PropertyCard({ property }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: property.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.text}>
          {property.city} • {property.type}
        </Text>
        <Text style={styles.text}>
          {property.area} м² • {property.rooms} кімн.
        </Text>
        <Text style={styles.price}>
          {property.price.toLocaleString()} ₴
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    color: "#E67E22",
    fontWeight: "700",
    marginTop: 6,
  },
});
