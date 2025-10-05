import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import FilterSidebar from "../components/FilterSidebar";
import PropertyCard from "../components/PropertyCard";
import propertiesData from "../data/properties.json";

export default function HomeScreen() {
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    minPrice: 0,
    maxPrice: 10000000,
    rooms: "",
  });

  const [filteredProperties, setFilteredProperties] = useState(propertiesData);

  useEffect(() => {
    const results = propertiesData.filter((p) => {
      return (
        (filters.city === "" || p.city === filters.city) &&
        (filters.type === "" || p.type === filters.type) &&
        p.price >= filters.minPrice &&
        p.price <= filters.maxPrice &&
        (filters.rooms === "" || p.rooms === filters.rooms)
      );
    });
    setFilteredProperties(results);
  }, [filters]);

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <FilterSidebar filters={filters} setFilters={setFilters} />
      </View>
      <ScrollView style={styles.catalog}>
        <Text style={styles.title}>Каталог нерухомості</Text>
        <View style={styles.grid}>
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
    flex: 1,
  },
  sidebar: {
    width: 280,
    backgroundColor: "#fff",
    padding: 16,
    borderRightWidth: 1,
    borderColor: "#e0e0e0",
  },
  catalog: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 16,
  },
});
