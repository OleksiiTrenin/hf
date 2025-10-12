import React from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";

export default function Header({ onToggleFilters }) {
  return (
    <View style={styles.header}>
      {/* Ліва частина: логотип */}
      <View style={styles.left}>
        <Image
          source={{ uri: "https://prorappestate.com/assets/logo-black.svg" }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.brand}>Pro8Rapp Estate</Text>
      </View>

      {/* Центр: кнопка і пошук */}
      <View style={styles.center}>
        <TouchableOpacity style={styles.filterButton} onPress={onToggleFilters}>
          <Text style={styles.filterButtonText}>← Сховати фільтри</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Пошук..."
          placeholderTextColor="#777"
          style={styles.searchInput}
        />
      </View>

      {/* Права частина: валюта */}
      <View style={styles.right}>
        <Text style={styles.currency}>$ USD</Text>
        <Text style={[styles.currency, { color: "#ff9900" }]}>₴ UAH</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 36, height: 36 },
  brand: { fontSize: 18, fontWeight: "700", color: "#111" },
  center: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: 500,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "#ff9900",
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  filterButtonText: { color: "#ff9900", fontWeight: "600" },
  searchInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 24,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  right: { flexDirection: "row", alignItems: "center", gap: 10 },
  currency: { fontSize: 14, fontWeight: "600", color: "#777" },
});
