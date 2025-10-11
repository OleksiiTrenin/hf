import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";

const { width: screenWidth } = Dimensions.get('window');

export default function FilterSidebar({
  filters,
  setFilters,
  currency,
  formatPrice,
  data,
}) {
  const cities = useMemo(
    () => [...new Set(data.map((p) => p.city))].sort(),
    [data]
  );
  const types = useMemo(() => [...new Set(data.map((p) => p.type))], [data]);

  const minPriceAll = Math.min(...data.map((p) => p.price));
  const maxPriceAll = Math.max(...data.map((p) => p.price));

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const priceSuggestions = [
    1300000, 2000000, 2700000, 3500000, 4200000,
    5200000, 6300000, 7400000, 8400000, 10500000,
  ];

  // Анімації для кожного елементу списку
  const animValues = useRef(priceSuggestions.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const minP = priceFrom ? parseInt(priceFrom) : minPriceAll;
    const maxP = priceTo ? parseInt(priceTo) : maxPriceAll;
    setFilters((f) => ({
      ...f,
      minPrice: minP,
      maxPrice: maxP,
    }));
  }, [priceFrom, priceTo]);

  // Функція для анімації при виборі ціни
  const handlePriceSelect = (price, index) => {
    // Анімація для обраного елементу
    Animated.sequence([
      Animated.timing(animValues[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animValues[index], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();

    setSelectedPrice(price);
    
    if (showDropdown === "min") {
      setPriceFrom(String(price));
    } else if (showDropdown === "max") {
      setPriceTo(String(price));
    }
    
    setTimeout(() => {
      setShowDropdown(null);
      setSelectedPrice(null);
    }, 300);
  };

  const areaOptions = [30, 40, 50, 60, 70, 90, 100, 120, 150, 200, 250 ];

  const handleAreaSelect = (val, type) => {
    if (type === "min") {
      setFilters((prev) => ({
        ...prev,
        minArea: prev.minArea === val ? undefined : val,
      }));
    }
    if (type === "max") {
      setFilters((prev) => ({
        ...prev,
        maxArea: prev.maxArea === val ? undefined : val,
      }));
    }
  };

  const Pill = ({ field, value, label }) => {
    const active = filters[field] === value;
    return (
      <TouchableOpacity
        onPress={() => setFilters({ ...filters, [field]: active ? "" : value })}
        style={[styles.pill, active && styles.pillActive]}
      >
        <Text style={[styles.pillText, active && styles.pillTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const Section = ({ id, title, children }) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setOpen((p) => ({ ...p, [id]: !p[id] }))}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
      </TouchableOpacity>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 16 }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Фільтри</Text>
        <TouchableOpacity
          onPress={() => {
            setFilters({});
            setPriceFrom("");
            setPriceTo("");
          }}
        >
          <Text style={styles.reset}>Скинути</Text>
        </TouchableOpacity>
      </View>

      {/* ---- Місто ---- */}
      <Section id="city" title="Місто">
        <View style={styles.pillRow}>
          {cities.map((c) => (
            <Pill key={c} field="city" value={c} label={c} />
          ))}
        </View>
      </Section>

      {/* ---- Тип ---- */}
      <Section id="type" title="Тип нерухомості">
        <View style={styles.pillRow}>
          {types.map((t) => (
            <Pill key={t} field="type" value={t} label={t} />
          ))}
        </View>
      </Section>

      {/* ---- Кімнати ---- */}
      <Section id="rooms" title="Кількість кімнат">
        <View style={styles.pillRow}>
          {["1", "2", "3", "4+"].map((r) => (
            <Pill key={r} field="rooms" value={r} label={r} />
          ))}
        </View>
      </Section>

      {/* ---- Рік ---- */}
      <Section id="year" title="Заплановане введення">
        <View style={styles.pillRow}>
          {["2025", "2026", "2027", "2028+"].map((y) => (
            <Pill key={y} field="yearPlanned" value={y} label={y} />
          ))}
        </View>
      </Section>

      {/* ---- ЦІНА ---- */}
      <Section id="price" title="Ціна">
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <TouchableOpacity
              style={[
                styles.dropdownInput,
                showDropdown === "min" && styles.dropdownInputActive
              ]}
              onPress={() =>
                setShowDropdown(showDropdown === "min" ? null : "min")
              }
            >
              <Text style={[
                styles.dropdownTextInput,
                priceFrom && styles.dropdownTextInputSelected
              ]}>
                {priceFrom ? formatPrice(priceFrom) : "Від"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dropdownInput,
                showDropdown === "max" && styles.dropdownInputActive
              ]}
              onPress={() =>
                setShowDropdown(showDropdown === "max" ? null : "max")
              }
            >
              <Text style={[
                styles.dropdownTextInput,
                priceTo && styles.dropdownTextInputSelected
              ]}>
                {priceTo ? formatPrice(priceTo) : "До"}
              </Text>
            </TouchableOpacity>
          </View>

          {showDropdown && (
            <View style={styles.dropdownBox}>
              <ScrollView 
                style={styles.dropdownScroll}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {priceSuggestions.map((p, index) => {
                  const isSelected = selectedPrice === p;
                  const backgroundColor = animValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#fff', '#fff8f0']
                  });
                  const scale = animValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.98]
                  });

                  return (
                    <AnimatedTouchable
                      key={p}
                      style={[
                        styles.dropdownItem,
                        {
                          backgroundColor,
                          transform: [{ scale }]
                        }
                      ]}
                      onPress={() => handlePriceSelect(p, index)}
                    >
                      <View style={styles.dropdownItemContent}>
                        <Text style={[
                          styles.dropdownItemText,
                          isSelected && styles.dropdownItemTextSelected
                        ]}>
                          {formatPrice(p)}
                        </Text>
                        {isSelected && (
                          <View style={styles.selectedIndicator}>
                            <Text style={styles.selectedIndicatorText}>✓</Text>
                          </View>
                        )}
                      </View>
                    </AnimatedTouchable>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>

        <Text style={styles.hint}>
          {currency === "UAH" ? "₴" : "$"} ({formatPrice(minPriceAll)} — {formatPrice(maxPriceAll)})
        </Text>
      </Section>

      {/* ---- Площа ---- */}
      <Section id="area" title="Площа (м²)">
        <Text style={styles.subTitle}>Від:</Text>
        <View style={styles.pillRow}>
          {areaOptions.map((a) => (
            <TouchableOpacity
              key={`min-${a}`}
              style={[
                styles.pill,
                filters.minArea === a && styles.pillActive,
              ]}
              onPress={() => handleAreaSelect(a, "min")}
            >
              <Text
                style={[
                  styles.pillText,
                  filters.minArea === a && styles.pillTextActive,
                ]}
              >
                {a}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.subTitle, { marginTop: 10 }]}>До:</Text>
        <View style={styles.pillRow}>
          {areaOptions.map((a) => (
            <TouchableOpacity
              key={`max-${a}`}
              style={[
                styles.pill,
                filters.maxArea === a && styles.pillActive,
              ]}
              onPress={() => handleAreaSelect(a, "max")}
            >
              <Text
                style={[
                  styles.pillText,
                  filters.maxArea === a && styles.pillTextActive,
                ]}
              >
                {a}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Section>
    </ScrollView>
  );
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    minHeight: '100%',
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111" },
  reset: { color: "#ff9900", fontWeight: "600" },
  section: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 15, fontWeight: "600" },
  sectionBody: { marginTop: 8 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pill: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  pillActive: { backgroundColor: "#ff9900", borderColor: "#ff9900" },
  pillText: { color: "#444" },
  pillTextActive: { color: "#fff", fontWeight: "700" },
  priceContainer: {
    minHeight: 50, // Мінімальна висота для секції ціни
  },
  priceRow: {
    flexDirection: "row",
    gap: 10,
    zIndex: 10,
  },
  dropdownInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dropdownInputActive: {
    borderColor: "#ff9900",
    backgroundColor: "#fff8f0",
  },
  dropdownTextInput: {
    fontSize: 14,
    color: "#999",
  },
  dropdownTextInputSelected: {
    color: "#111",
    fontWeight: "600",
  },
  dropdownBox: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
    maxHeight: 250, // Збільшена максимальна висота
    minHeight: 200, // Мінімальна висота для кращого відображення
    width: '100%',
    zIndex: 100,
  },
  dropdownScroll: {
    flex: 1,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    minHeight: 44,
  },
  dropdownItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownItemTextSelected: {
    color: "#ff9900",
    fontWeight: "700",
  },
  selectedIndicator: {
    backgroundColor: "#ff9900",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedIndicatorText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  hint: { 
    textAlign: "center", 
    color: "#666", 
    fontSize: 12, 
    marginTop: 6,
    marginBottom: 4,
  },
  subTitle: { fontWeight: "600", color: "#444", marginBottom: 4, marginTop: 4 },
});