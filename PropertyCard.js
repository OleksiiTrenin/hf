import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";

// ⚡ автоматичне підключення всіх локальних зображень
const importAll = (r) => {
  let images = {};
  r.keys().forEach((key) => {
    const name = key.replace("./", ""); // прибирає "./" з назв
    images[name] = r(key);
  });
  return images;
};

// підтягуємо всі зображення з папки
const images = importAll(require.context("../assets/images", false, /\.(png|jpe?g|svg)$/));

export default function PropertyCard({ property, currency, formatPrice }) {
  const scale = useRef(new Animated.Value(1)).current;
  const shadow = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  // плавна поява
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, []);

  // анімація при наведенні
  const onHoverIn = () => {
    if (Platform.OS === "web") {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1.02, friction: 6, useNativeDriver: true }),
        Animated.timing(shadow, { toValue: 1, duration: 200, useNativeDriver: false }),
      ]).start();
    }
  };

  const onHoverOut = () => {
    if (Platform.OS === "web") {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
        Animated.timing(shadow, { toValue: 0, duration: 200, useNativeDriver: false }),
      ]).start();
    }
  };

  // динамічна тінь
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

  // визначаємо джерело фото
  const getImageSource = () => {
    const img = property.image;
    if (img?.startsWith?.("http")) return { uri: img }; // якщо URL
    if (images[img]) return images[img]; // якщо є локальний
    return require("../assets/images/placeholder.jpg"); // запасний варіант
  };

  return (
    <Animated.View
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      style={[styles.card, shadowStyle, { transform: [{ scale }], opacity: fade }]}
    >
      <Animated.Image
        source={getImageSource()}
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
    cursor: "pointer",
    transitionDuration: "0.25s",
  },
  image: {
    width: "100%",
    height: 290,
  },
  info: {
    padding: 14,
  },
  title: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 2,
  },
  subtitle: {
    color: "#666",
    fontSize: 12,
    marginBottom: 6,
  },
  price: {
    fontWeight: "700",
    color: "#111",
  },
});
