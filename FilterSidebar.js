import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

// беремо реальні міста з даних
const properties = require("../data/properties.json");
const unique = (arr) => Array.from(new Set(arr));

const CITIES = unique(properties.map((p) => p.city)).sort();
const TYPES  = unique(properties.map((p) => p.type)); // ["Квартира","Будинок"] для твого JSON

const Section = ({ title, expanded, onToggle, children }) => (
  <View style={styles.section}>
    <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.chevron}>{expanded ? "▾" : "▸"}</Text>
    </TouchableOpacity>
    {expanded && <View style={styles.sectionBody}>{children}</View>}
  </View>
);

export default function FilterSidebar({ filters, setFilters }) {
  const [open, setOpen] = useState({
    city: true, type: true, rooms: true, year: true, price: true, area: true,
  });

  const setF = (k, v) => setFilters({ ...filters, [k]: v });

  const Pill = ({ field, value, label }) => {
    const active = filters[field] === value;
    return (
      <TouchableOpacity
        onPress={() => setF(field, active ? "" : value)}
        style={[styles.pill, active && styles.pillActive]}
      >
        <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const clearAll = () =>
    setFilters({ city: "", type: "", rooms: "", yearPlanned: "", priceBand: "", areaBand: "" });

  // мапи категорій
  const priceOptions = useMemo(
    () => [
      { v: "to2m",     label: "До 2 000 000 ₴" },
      { v: "2to2_5m",  label: "2–2.5 млн ₴"   },
      { v: "from2_5m", label: "Від 2.5 млн ₴" },
    ],
    []
  );

  const areaOptions = useMemo(
    () => [
      { v: "to70",     label: "До 70 м²"   },
      { v: "70to120",  label: "70–120 м²"  },
      { v: "from120",  label: "120+ м²"    },
    ],
    []
  );

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={{ paddingBottom: 12 }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Фільтри</Text>
        <TouchableOpacity onPress={clearAll}>
          <Text style={styles.reset}>Скинути</Text>
        </TouchableOpacity>
      </View>

      {/* Місто */}
      <Section
        title="Місто"
        expanded={open.city}
        onToggle={() => setOpen({ ...open, city: !open.city })}
      >
        <View style={styles.pillRow}>
          {CITIES.map((c) => (
            <Pill key={c} field="city" value={c} label={c} />
          ))}
        </View>
      </Section>

      {/* Тип нерухомості */}
      <Section
        title="Тип нерухомості"
        expanded={open.type}
        onToggle={() => setOpen({ ...open, type: !open.type })}
      >
        <View style={styles.pillRow}>
          {TYPES.map((t) => (
            <Pill key={t} field="type" value={t} label={t} />
          ))}
        </View>
      </Section>

      {/* Кількість кімнат */}
      <Section
        title="Кількість кімнат"
        expanded={open.rooms}
        onToggle={() => setOpen({ ...open, rooms: !open.rooms })}
      >
        <View style={styles.pillRow}>
          {["1", "2", "3", "4+"].map((r) => (
            <Pill key={r} field="rooms" value={r} label={r} />
          ))}
        </View>
      </Section>

      {/* Заплановане введення */}
      <Section
        title="Заплановане введення"
        expanded={open.year}
        onToggle={() => setOpen({ ...open, year: !open.year })}
      >
        <View style={styles.pillRow}>
          {["2025", "2026", "2027", "2028+"].map((y) => (
            <Pill key={y} field="yearPlanned" value={y} label={y} />
          ))}
        </View>
      </Section>

      {/* Ціна */}
      <Section
        title="Ціна"
        expanded={open.price}
        onToggle={() => setOpen({ ...open, price: !open.price })}
      >
        <View style={styles.pillRow}>
          {priceOptions.map((o) => (
            <Pill key={o.v} field="priceBand" value={o.v} label={o.label} />
          ))}
        </View>
      </Section>

      {/* Площа */}
      <Section
        title="Площа"
        expanded={open.area}
        onToggle={() => setOpen({ ...open, area: !open.area })}
      >
        <View style={styles.pillRow}>
          {areaOptions.map((o) => (
            <Pill key={o.v} field="areaBand" value={o.v} label={o.label} />
          ))}
        </View>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#111" },
  reset: { color: "#ff9900", fontWeight: "600" },

  section: { marginTop: 12, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#000" },
  chevron: { fontSize: 16, color: "#777" },
  sectionBody: { marginTop: 8 },

  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  pillActive: { backgroundColor: "#ff9900", borderColor: "#ff9900" },
  pillText: { color: "#333" },
  pillTextActive: { color: "#fff", fontWeight: "700" },
});
