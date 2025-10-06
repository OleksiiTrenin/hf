import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Animated,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const Slider =
  Platform.OS === "web"
    ? ({ min, max, step, value, onValueChange }) => (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      )
    : require("@react-native-community/slider").default;

export default function FilterSidebar({ filters, setFilters }) {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpanded = () => {
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 420],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Фільтри</Text>

      {/* Місто */}
      <Text style={styles.label}>Місто</Text>
      <Picker
        selectedValue={filters.city}
        onValueChange={(v) => setFilters({ ...filters, city: v })}
        style={styles.picker}
      >
        <Picker.Item label="Усі" value="" />
        <Picker.Item label="Львів" value="Львів" />
        <Picker.Item label="Київ" value="Київ" />
        <Picker.Item label="Варшава" value="Варшава" />
      </Picker>

      {/* Тип нерухомості */}
      <Text style={styles.label}>Тип нерухомості</Text>
      <Picker
        selectedValue={filters.type}
        onValueChange={(v) => setFilters({ ...filters, type: v })}
        style={styles.picker}
      >
        <Picker.Item label="Усі" value="" />
        <Picker.Item label="Квартира" value="Квартира" />
        <Picker.Item label="Будинок" value="Будинок" />
      </Picker>

      {/* Прихований блок */}
      <Animated.View style={{ overflow: "hidden", height: animatedHeight }}>
        <Text style={styles.label}>Ціна (₴)</Text>
        <Slider
          min={0}
          max={10000000}
          step={50000}
          value={filters.price || 0}
          onValueChange={(v) => setFilters({ ...filters, price: v })}
        />
        <Text>{filters.price?.toLocaleString() || 0} ₴</Text>

        <Text style={styles.label}>Площа (м²)</Text>
        <Slider
          min={0}
          max={300}
          step={1}
          value={filters.area || 0}
          onValueChange={(v) => setFilters({ ...filters, area: v })}
        />
        <Text>{filters.area || 0} м²</Text>

        <Text style={styles.label}>Кількість кімнат</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Наприклад: 2"
          value={String(filters.rooms || "")}
          onChangeText={(v) => setFilters({ ...filters, rooms: Number(v) })}
        />

        <Text style={styles.label}>Рік введення</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="2024"
          value={String(filters.year || "")}
          onChangeText={(v) => setFilters({ ...filters, year: Number(v) })}
        />
      </Animated.View>

      {/* Кнопка */}
      <TouchableOpacity style={styles.button} onPress={toggleExpanded}>
        <Text style={styles.buttonText}>
          {expanded ? "Сховати фільтр ▲" : "Розгорнути фільтр ▼"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  label: { fontWeight: "600", marginTop: 10 },
  picker: { backgroundColor: "#f3f3f3", marginTop: 5 },
  input: {
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    padding: 8,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#E67E22",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
