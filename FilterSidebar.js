import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function FilterSidebar({ filters, setFilters, currency, formatPrice, data }) {
  const cities = useMemo(() => [...new Set(data.map((p) => p.city))].sort(), [data]);
  const types = useMemo(() => [...new Set(data.map((p) => p.type))], [data]);
  const minPriceAll = Math.min(...data.map((p) => p.price));
  const maxPriceAll = Math.max(...data.map((p) => p.price));
  const minAreaAll = Math.min(...data.map((p) => p.area));
  const maxAreaAll = Math.max(...data.map((p) => p.area));

  const [minPrice, setMinPrice] = useState(filters.minPrice ?? minPriceAll);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ?? maxPriceAll);
  const [minArea, setMinArea] = useState(filters.minArea ?? minAreaAll);
  const [maxArea, setMaxArea] = useState(filters.maxArea ?? maxAreaAll);
  const [open, setOpen] = useState({ city: true, type: true, rooms: true, year: true, price: true, area: true });
  const toggle = (k) => setOpen((p) => ({ ...p, [k]: !p[k] }));
  const setF = (k, v) => setFilters({ ...filters, [k]: v });
  const resetAll = () => { setFilters({}); setMinPrice(minPriceAll); setMaxPrice(maxPriceAll); setMinArea(minAreaAll); setMaxArea(maxAreaAll); };

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

  const Slider = ({ min, max, valMin, valMax, setValMin, setValMax, step = 1 }) => {
    const range = max - min;
    const width = 200;
    const minPos = ((valMin - min) / range) * width;
    const maxPos = ((valMax - min) / range) * width;

    const onTrackPress = (e) => {
      const clickX = e.nativeEvent.locationX;
      const distToMin = Math.abs(clickX - minPos);
      const distToMax = Math.abs(clickX - maxPos);
      if (distToMin < distToMax) {
        const newVal = Math.min(valMax - step, min + (clickX / width) * range);
        setValMin(Math.round(newVal));
        setF("minPrice", newVal);
      } else {
        const newVal = Math.max(valMin + step, min + (clickX / width) * range);
        setValMax(Math.round(newVal));
        setF("maxPrice", newVal);
      }
    };

    return (
      <TouchableOpacity style={styles.sliderWrap} onPress={onTrackPress} activeOpacity={1}>
        <View style={styles.sliderTrack} />
        <View style={[styles.sliderRange, { left: minPos, width: maxPos - minPos }]} />
        <View style={[styles.sliderThumb, { left: minPos - 9 }]} />
        <View style={[styles.sliderThumb, { left: maxPos - 9 }]} />
      </TouchableOpacity>
    );
  };

  const Section = ({ id, title, children }) => (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={() => toggle(id)}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.chevron}>{open[id] ? "▾" : "▸"}</Text>
      </TouchableOpacity>
      {open[id] && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Фільтри</Text>
        <TouchableOpacity onPress={resetAll}><Text style={styles.reset}>Скинути</Text></TouchableOpacity>
      </View>

      <Section id="city" title="Місто">
        <View style={styles.pillRow}>{cities.map((c) => <Pill key={c} field="city" value={c} label={c} />)}</View>
      </Section>

      <Section id="type" title="Тип нерухомості">
        <View style={styles.pillRow}>{types.map((t) => <Pill key={t} field="type" value={t} label={t} />)}</View>
      </Section>

      <Section id="rooms" title="Кількість кімнат">
        <View style={styles.pillRow}>{["1", "2", "3", "4+"].map((r) => <Pill key={r} field="rooms" value={r} label={r} />)}</View>
      </Section>

      <Section id="year" title="Заплановане введення">
        <View style={styles.pillRow}>{["2025", "2026", "2027", "2028+"].map((y) => <Pill key={y} field="yearPlanned" value={y} label={y} />)}</View>
      </Section>

      <Section id="price" title="Ціна">
        <Text style={styles.sliderLabel}>{formatPrice(minPrice)} — {formatPrice(maxPrice)}</Text>
        <Slider
          min={minPriceAll}
          max={maxPriceAll}
          valMin={minPrice}
          valMax={maxPrice}
          setValMin={setMinPrice}
          setValMax={setMaxPrice}
        />
      </Section>

      <Section id="area" title="Площа">
        <Text style={styles.sliderLabel}>{Math.round(minArea)} м² — {Math.round(maxArea)} м²</Text>
        <Slider
          min={minAreaAll}
          max={maxAreaAll}
          valMin={minArea}
          valMax={maxArea}
          setValMin={setMinArea}
          setValMax={setMaxArea}
        />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", borderRadius: 12, padding: 14 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700" },
  reset: { color: "#ff9900", fontWeight: "600" },
  section: { marginTop: 10, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 10 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between" },
  sectionTitle: { fontWeight: "600", color: "#222" },
  chevron: { fontSize: 14, color: "#777" },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pill: { borderWidth: 1, borderColor: "#ccc", borderRadius: 16, paddingVertical: 4, paddingHorizontal: 10 },
  pillActive: { backgroundColor: "#ff9900", borderColor: "#ff9900" },
  pillText: { color: "#444" },
  pillTextActive: { color: "#fff", fontWeight: "700" },
  sliderWrap: { width: 200, height: 30, justifyContent: "center" },
  sliderTrack: { position: "absolute", height: 4, backgroundColor: "#ddd", width: "100%", borderRadius: 2 },
  sliderRange: { position: "absolute", height: 4, backgroundColor: "#ff9900", borderRadius: 2 },
  sliderThumb: { position: "absolute", width: 18, height: 18, borderRadius: 9, backgroundColor: "#ff9900", top: 6 },
  sliderLabel: { fontWeight: "600", marginBottom: 8, textAlign: "center", color: "#333" },
});
