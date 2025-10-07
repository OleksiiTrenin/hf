import React, { useMemo, useState } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import FilterSidebar from "../components/FilterSidebar";
import PropertyCard from "../components/PropertyCard";
import propertiesData from "../data/properties.json";

const RATES = { UAH: 1, USD: 40 };

export default function HomeScreen() {
  const [filters, setFilters] = useState({});
  const [currency, setCurrency] = useState("UAH");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  const width = Dimensions.get("window").width;
  const isWide = width > 900;
  const numColumns = isWide ? (showFilters ? 2 : 3) : 1;

  const formatPrice = (uah) => {
    const val =
      currency === "UAH" ? uah : Math.round((uah / RATES.USD) * 100) / 100;
    const label = currency === "UAH" ? "₴" : "$";
    return `${label} ${val.toLocaleString("uk-UA")}`;
  };

  const filtered = useMemo(() => {
    return propertiesData.filter((item) => {
      const {
        city,
        type,
        rooms,
        yearPlanned,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
      } = filters;

      const cityOk = !city || item.city === city;
      const typeOk = !type || item.type === type;
      const roomsOk =
        !rooms ||
        (rooms === "4+" ? item.rooms >= 4 : item.rooms === parseInt(rooms));
      const yearOk =
        !yearPlanned ||
        (yearPlanned === "2028+"
          ? item.year >= 2028
          : item.year === parseInt(yearPlanned));
      const priceOk =
        (!minPrice && !maxPrice) ||
        (item.price >= (minPrice || 0) && item.price <= (maxPrice || Infinity));
      const areaOk =
        (!minArea && !maxArea) ||
        (item.area >= (minArea || 0) && item.area <= (maxArea || Infinity));

      const q = search.trim().toLowerCase();
      const searchOk =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q);

      return cityOk && typeOk && roomsOk && yearOk && priceOk && areaOk && searchOk;
    });
  }, [filters, search]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: "https://prorappestate.com/assets/logo-black.svg" }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brand}>ProRapp Estate</Text>
        </View>

        <View style={styles.headerCenter}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters((v) => !v)}
          >
            <Text style={styles.filterButtonText}>
              {showFilters ? "← Сховати фільтри" : "Показати фільтри →"}
            </Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Пошук..."
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setCurrency("USD")}>
            <Text style={[styles.curr, currency === "USD" && styles.currActive]}>
              $ USD
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrency("UAH")}>
            <Text style={[styles.curr, currency === "UAH" && styles.currActive]}>
              ₴ UAH
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY */}
      <View style={[styles.page, { flexDirection: isWide ? "row" : "column" }]}>
        {showFilters && (
          <View style={[styles.sidebar, { flex: isWide ? 0.18 : 1 }]}>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              currency={currency}
              formatPrice={formatPrice}
              data={propertiesData}
            />
          </View>
        )}

        <View
          style={[
            styles.list,
            { flex: isWide ? (showFilters ? 0.82 : 1) : 1 },
          ]}
        >
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            numColumns={numColumns}
            key={`cols-${numColumns}`}
            renderItem={({ item }) => (
              <View style={styles.cardCol}>
                <PropertyCard
                  property={item}
                  currency={currency}
                  formatPrice={formatPrice}
                />
              </View>
            )}
            showsVerticalScrollIndicator
            contentContainerStyle={{ paddingBottom: 24 }}
            columnWrapperStyle={
              numColumns > 1 ? { justifyContent: "space-between" } : undefined
            }
          />
        </View>
      </View>
    </SafeAreaView>
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
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 36, height: 36 },
  brand: { fontSize: 18, fontWeight: "700", color: "#111" },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: 520,
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
    backgroundColor: "#fafafa",
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  curr: { fontSize: 14, fontWeight: "600", color: "#777" },
  currActive: { color: "#ff9900" },
  page: { flex: 1, backgroundColor: "#f8f8f8", padding: 16, gap: 16 },
  sidebar: { minWidth: 260, maxWidth: 320 },
  list: { flex: 1 },
  cardCol: { flex: 1, paddingHorizontal: 8, paddingVertical: 8 },
});
