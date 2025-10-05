import React, { useRef, useEffect } from "react";
import { Animated, Image, Text, View, StyleSheet } from "react-native";

export default function PropertyCard({ property }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <Image source={{ uri: property.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{property.title}</Text>
        <Text style={styles.city}>
          {property.city} • {property.type}
        </Text>
        <Text style={styles.price}>{property.price.toLocaleString()} ₴</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 160,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  city: {
    color: "#666",
    marginVertical: 4,
  },
  price: {
    fontWeight: "700",
    color: "#F97316",
  },
});
