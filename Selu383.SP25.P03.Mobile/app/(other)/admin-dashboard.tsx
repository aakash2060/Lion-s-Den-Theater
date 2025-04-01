import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";

type DashboardItem = {
  label: string;
  description: string;
};

const AdminDashboard = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);

  // Protect the route: allow only Admins
  useEffect(() => {
    if (!auth?.user || !auth.user.roles?.includes("Admin")) {
      router.replace("/");
    }
  }, []);

  const dashboardItems: DashboardItem[] = [
    {
      label: "Statistics",
      description: "View app-wide stats and analytics.",
    },
    {
      label: "Users",
      description: "Manage registered users.",
    },
    {
      label: "Movies",
      description: "Add, update, and delete movies.",
    },
    {
        label: "Theaters",
        description: "Add, update, and delete THeaters"
    }
  ];

  const handleComingSoon = (label: string) => {
    Alert.alert(`${label}`, "This page is coming soon!");
  };

  return (
    <ScrollView className="flex-1 bg-black px-6 pt-12">
      <Text className="text-white text-3xl font-bold mb-8">
        Admin Dashboard
      </Text>

      <View className="gap-6">
        {dashboardItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => handleComingSoon(item.label)}
            className="bg-gray-900 border border-gray-700 rounded-xl p-6"
            activeOpacity={0.85}
          >
            <Text className="text-white text-xl font-semibold">
              {item.label}
            </Text>
            <Text className="text-gray-400 mt-2 text-sm">
              {item.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;
