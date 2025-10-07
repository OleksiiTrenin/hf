import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Image
          source={{ uri: "https://prorappestate.com/assets/logo-black.svg" }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>ProRapp Estate</Text>
      </View>
      <Text style={styles.currency}>₴ UAH</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
  },
  left: { flexDirection: "row", alignItems: "center" },
  logo: { width: 40, height: 40, marginRight: 8 },
  title: { fontSize: 20, fontWeight: "bold" },
  currency: { fontSize: 16, fontWeight: "600", color: "#ff9900" },
});
