import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import FilterSidebar from "../components/FilterSidebar";
import PropertyCard from "../components/PropertyCard";
import propertiesData from "../data/properties.json";

export default function HomeScreen() {
  const [filters, setFilters] = useState({});
  const [properties] = useState(propertiesData);

  const filtered = properties.filter((item) => {
    const {
      city, type, rooms, yearPlanned, priceBand, areaBand,
    } = filters;

    const cityOk = !city || item.city === city;
    const typeOk = !type || item.type === type;

    const roomsOk =
      !rooms ||
      (rooms === "4+" ? item.rooms >= 4 : item.rooms === parseInt(rooms));

    const yearOk =
      !yearPlanned ||
      (yearPlanned === "2028+" ? item.year >= 2028 : item.year === parseInt(yearPlanned));

    const priceOk =
      !priceBand ||
      (priceBand === "to2m"
        ? item.price <= 2000000
        : priceBand === "2to2_5m"
        ? item.price > 2000000 && item.price <= 2500000
        : item.price > 2500000);

    const areaOk =
      !areaBand ||
      (areaBand === "to70"
        ? item.area <= 70
        : areaBand === "70to120"
        ? item.area > 70 && item.area <= 120
        : item.area > 120);

    return cityOk && typeOk && roomsOk && yearOk && priceOk && areaOk;
  });

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <FilterSidebar filters={filters} setFilters={setFilters} />
      </View>
      <ScrollView style={styles.list}>
        {filtered.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flexDirection: width > 900 ? "row" : "column",
    backgroundColor: "#f8f8f8",
    flex: 1,
    padding: 16,
    gap: 16,
  },
  sidebar: { flex: width > 900 ? 0.28 : 1 },
  list: { flex: width > 900 ? 0.72 : 1 },
});
