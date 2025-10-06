import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import FilterSidebar from "../components/FilterSidebar";
import PropertyCard from "../components/PropertyCard";
import propertiesData from "../data/properties.json";

export default function HomeScreen() {
  const [filters, setFilters] = useState({});
  const [properties, setProperties] = useState(propertiesData);

  const filtered = properties.filter((item) => {
    const { city, type, price, area, rooms, year } = filters;
    return (
      (!city || item.city === city) &&
      (!type || item.type === type) &&
      (!price || item.price <= price) &&
      (!area || item.area >= area) &&
      (!rooms || item.rooms === rooms) &&
      (!year || item.year === year)
    );
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
  },
  sidebar: {
    flex: width > 900 ? 0.3 : 1,
    marginRight: width > 900 ? 20 : 0,
  },
  list: {
    flex: width > 900 ? 0.7 : 1,
  },
});
