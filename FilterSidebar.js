import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// Слайдер: fallback для web через <input>, для native через community slider
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

  const toggleExpanded = () => setExpanded((e) => !e);

  const onChangeRange = (field, type, value) => {
    setFilters({
      ...filters,
      [field]: {
        ...filters[field],
        [type]: value,
      },
    });
  };

  return (
    <View>
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
        <Picker.Item label="Одеса" value="Одеса" />
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
        <Picker.Item label="Офіс" value="Офіс" />
      </Picker>

      {/* Ціна */}
      <Text style={styles.label}>Ціна (₴)</Text>
      <View style={styles.rangeRow}>
        <TextInput
          style={[styles.input, styles.rangeInput]}
          keyboardType="numeric"
          value={String(filters.price?.min ?? "")}
          placeholder="Від"
          onChangeText={(v) =>
            setFilters({
              ...filters,
              price: { ...filters.price, min: Number(v) },
            })
          }
        />
        <TextInput
          style={[styles.input, styles.rangeInput]}
          keyboardType="numeric"
          value={String(filters.price?.max ?? "")}
          placeholder="До"
          onChangeText={(v) =>
            setFilters({
              ...filters,
              price: { ...filters.price, max: Number(v) },
            })
          }
        />
      </View>
      <Slider
        minimumValue={0}
        maximumValue={10000000}
        step={1000}
        value={filters.price?.min ?? 0}
        onValueChange={(v) => onChangeRange("price", "min", v)}
      />

      {/* Площа */}
      <Text style={styles.label}>Площа (м²)</Text>
      <View style={styles.rangeRow}>
        <TextInput
          style={[styles.input, styles.rangeInput]}
          keyboardType="numeric"
          value={String(filters.area?.min ?? "")}
          placeholder="Від"
          onChangeText={(v) =>
            setFilters({
              ...filters,
              area: { ...filters.area, min: Number(v) },
            })
          }
        />
        <TextInput
          style={[styles.input, styles.rangeInput]}
          keyboardType="numeric"
          value={String(filters.area?.max ?? "")}
          placeholder="До"
          onChangeText={(v) =>
            setFilters({
              ...filters,
              area: { ...filters.area, max: Number(v) },
            })
          }
        />
      </View>
      <Slider
        minimumValue={0}
        maximumValue={1000}
        step={1}
        value={filters.area?.min ?? 0}
        onValueChange={(v) => onChangeRange("area", "min", v)}
      />

      {/* Кількість кімнат */}
      <Text style={styles.label}>Кімнати</Text>
      <TextInput
        style={styles.input}
        placeholder="Наприклад: 2"
        keyboardType="numeric"
        value={String(filters.rooms ?? "")}
        onChangeText={(v) => setFilters({ ...filters, rooms: Number(v) })}
      />

      {/* Заплановане введення */}
      <Text style={styles.label}>Рік введення</Text>
      <TextInput
        style={styles.input}
        placeholder="2025"
        keyboardType="numeric"
        value={String(filters.year ?? "")}
        onChangeText={(v) => setFilters({ ...filters, year: Number(v) })}
      />

      <View style={styles.buttonWrap}>
        <TouchableOpacity style={styles.button} onPress={toggleExpanded}>
          <Text style={styles.buttonText}>
            {expanded ? "Сховати" : "Показати більше"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    fontWeight: "600",
  },
  picker: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    marginTop: 4,
  },
  input: {
    backgroundColor: "#f3f3f3",
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: "#cccccc",
    marginTop: 4,
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rangeInput: {
    flex: 1,
    marginRight: 8,
  },
  buttonWrap: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#F97316",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
