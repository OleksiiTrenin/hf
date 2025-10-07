import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function PropertyCard({ property }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: property.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.subtitle}>
          {property.city} • {property.type} • {property.area} м² •{" "}
          {property.rooms} кімн. • {property.year}
        </Text>
        <Text style={styles.price}>₴ {property.price.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
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
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    color: "#555",
    marginBottom: 6,
  },
  price: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
