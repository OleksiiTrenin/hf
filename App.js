import React from "react";
import { SafeAreaView } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import { StatusBar } from "expo-status-bar";
import "./global.css";

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-lightGray">
      <StatusBar style="dark" />
      <HomeScreen />
    </SafeAreaView>
  );
}
