import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import Header from "./src/components/Header";
import HomeScreen from "./src/screens/HomeScreen";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <Header />
      <HomeScreen />
    </SafeAreaView>
  );
}
