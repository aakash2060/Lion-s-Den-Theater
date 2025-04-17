import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useTheater } from "@/context/TheaterContext";

const TheaterGuard = ({ children }: { children: React.ReactNode }) => {
  const { theater, loadingTheater } = useTheater();

  if (loadingTheater) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="red" />
        <Text className="text-white mt-4">⏳ Finding nearest theater...</Text>
      </View>
    );
  }

  if (!theater) {
    return (
      <View className="flex-1 justify-center items-center bg-black px-6">
        <Text className="text-white text-center text-lg">
           No theater selected. Please allow location or go to Theaters tab.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default TheaterGuard;
