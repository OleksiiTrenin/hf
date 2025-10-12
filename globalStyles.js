import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
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
  Animated,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import FilterSidebar from "../components/FilterSidebar";
import PropertyCard from "../components/PropertyCard";
import propertiesData from "../data/properties.json";

const RATES = { UAH: 1, USD: 40 };

const MobileHeader = ({ currency, setCurrency, search, setSearch, setShowFilters }) => (
  <View style={styles.mHeader}>
    <View style={styles.mTopRow}>
      <View style={styles.mBrandWrap}>
        <Image
          source={{ uri: "https://prorappestate.com/assets/logo-black.svg" }}
          style={styles.mLogo}
          resizeMode="contain"
        />
        <Text style={styles.mBrand}>ProRapp Estate</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
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
    <View style={styles.mBottomRow}>
      <TouchableOpacity
        onPress={() => setShowFilters(true)}
        style={styles.mFilterBtn}
      >
        <Text style={styles.mFilterBtnText}>Фільтри</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Пошук..."
        placeholderTextColor="#777"
        value={search}
        onChangeText={setSearch}
        style={styles.mSearch}
        returnKeyType="search"
      />
    </View>
  </View>
);

const DesktopHeader = ({ currency, setCurrency, search, setSearch, setShowFilters, showFilters }) => (
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
);

export default function HomeScreen() {
  const [filters, setFilters] = useState({});
  const [currency, setCurrency] = useState("UAH");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const width = Dimensions.get("window").width;
  const isWide = width > 900;
  const numColumns = isWide ? (showFilters ? 2 : 3) : 1;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showFilters ? 1 : 0,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [showFilters]);

  const handleSetFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const formatPrice = useCallback(
    (uah) => {
      const val = currency === "UAH" ? uah : Math.round(uah / RATES.USD);
      const label = currency === "UAH" ? "₴" : "$";
      return `${label} ${val.toLocaleString("uk-UA")}`;
    },
    [currency]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return propertiesData.filter((item) => {
      const { city, type, rooms, yearPlanned, minPrice, maxPrice, minArea, maxArea } = filters;
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
      {isWide ? (
        <DesktopHeader
          currency={currency}
          setCurrency={setCurrency}
          search={search}
          setSearch={setSearch}
          setShowFilters={setShowFilters}
          showFilters={showFilters}
        />
      ) : (
        <MobileHeader
          currency={currency}
          setCurrency={setCurrency}
          search={search}
          setSearch={setSearch}
          setShowFilters={setShowFilters}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View
          style={[
            styles.page,
            { flexDirection: isWide ? "row" : "column", paddingTop: isWide ? 16 : 10 },
          ]}
        >
          {/* ---- DESKTOP FILTER ---- */}
          {isWide ? (
            showFilters && (
              <View style={[styles.sidebar, { flex: 0.18 }]}>
                <FilterSidebar
                  filters={filters}
                  setFilters={handleSetFilters}
                  currency={currency}
                  formatPrice={formatPrice}
                  data={propertiesData}
                />
              </View>
            )
          ) : (
            <>
              {showFilters && (
                <View style={styles.overlay}>
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => setShowFilters(false)}
                  />
                </View>
              )}

              {/* ---- MOBILE FILTER ---- */}
              <Animated.View
                style={[
                  styles.mobileFilterWrapper,
                  {
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [Dimensions.get("window").height, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {showFilters && (
                  <View style={styles.mobileFilterBox}>
                    <ScrollView
                      contentContainerStyle={{
                        paddingBottom: 120,
                        paddingTop: 20,
                      }}
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="handled"
                    >
                      <FilterSidebar
                        filters={filters}
                        setFilters={handleSetFilters}
                        currency={currency}
                        formatPrice={formatPrice}
                        data={propertiesData}
                        hideTitle={true}
                      />
                    </ScrollView>

                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setShowFilters(false)}
                    >
                      <Text style={styles.closeText}>Закрити</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            </>
          )}

          <View style={[styles.list, { flex: isWide ? (showFilters ? 0.84 : 1) : 1 }]}>
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
      </KeyboardAvoidingView>
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

  mHeader: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "android" ? 12 : 14,
    paddingBottom: 8,
  },
  mTopRow: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mBrandWrap: { flexDirection: "row", alignItems: "center", gap: 6, marginLeft: -4 },
  mLogo: { width: 26, height: 26 },
  mBrand: { fontSize: 16, fontWeight: "700", color: "#111" },
  mBottomRow: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 8 },
  mFilterBtn: {
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#ff9900",
    justifyContent: "center",
    alignItems: "center",
  },
  mFilterBtnText: { color: "#ff9900", fontWeight: "700", fontSize: 14 },
  mSearch: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 22,
    paddingHorizontal: 12,
    backgroundColor: "#fafafa",
  },
  page: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 16,
  },
  sidebar: { minWidth: 260, maxWidth: 320 },
  list: { flex: 1 },
  cardCol: { flex: 1, paddingHorizontal: 8, paddingVertical: 8 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 40,
  },
  mobileFilterWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  mobileFilterBox: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 10,
    elevation: 8,
  },
  closeButton: {
    backgroundColor: "#ff9900",
    borderRadius: 22,
    paddingVertical: 14,
    marginTop: 10,
    marginBottom: 20,
  },
  closeText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});