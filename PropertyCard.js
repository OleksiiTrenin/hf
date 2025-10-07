import React, { useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, Animated, Platform } from "react-native";

export default function PropertyCard({ property, currency, formatPrice }) {
  const scale = useRef(new Animated.Value(1)).current;
  const shadow = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  // fade-in при появі
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, []);

  // плавний hover
  const onHoverIn = () => {
    if (Platform.OS === "web") {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1.02, friction: 5, useNativeDriver: true }),
        Animated.timing(shadow, { toValue: 1, duration: 200, useNativeDriver: false }),
      ]).start();
    }
  };

  const onHoverOut = () => {
    if (Platform.OS === "web") {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(shadow, { toValue: 0, duration: 200, useNativeDriver: false }),
      ]).start();
    }
  };

  const shadowStyle = {
    shadowColor: "#000",
    shadowOpacity: shadow.interpolate({
      inputRange: [0, 1],
      outputRange: [0.05, 0.18],
    }),
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: shadow.interpolate({
      inputRange: [0, 1],
      outputRange: [3, 10],
    }),
  };

  return (
    <Animated.View
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      style={[
        styles.card,
        shadowStyle,
        { transform: [{ scale }], opacity: fade },
      ]}
    >
      <Animated.Image
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
        <Text style={styles.price}>{formatPrice(property.price)}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
    elevation: 2,
    transitionDuration: "0.25s",
  },
  image: {
    width: "100%",
    height: 260, // трохи менше — виглядає краще
  },
  info: { padding: 14 },
  title: { fontWeight: "700", fontSize: 15, marginBottom: 2 },
  subtitle: { color: "#666", fontSize: 12, marginBottom: 6 },
  price: { fontWeight: "700", color: "#111" },
});
