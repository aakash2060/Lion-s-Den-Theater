import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "@/context/AuthContext";
import { BarChart3, Users2, Film, Building2 } from "lucide-react-native"; 

type DashboardItem = {
  label: string;
  description: string;
  icon: React.ReactNode;
};

const AdminDashboard = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!auth?.user || !auth.user.roles?.includes("Admin")) {
      router.replace("/");
    }
  }, []);

  const dashboardItems: DashboardItem[] = [
    {
      label: "Statistics",
      description: "View app-wide stats and analytics.",
      icon: <BarChart3 size={28} color="#ef4444" />, // red-500
    },
    {
      label: "Users",
      description: "Manage registered users.",
      icon: <Users2 size={28} color="#ef4444" />,
    },
    {
      label: "Movies",
      description: "Add, update, and delete movies.",
      icon: <Film size={28} color="#ef4444" />,
    },
    {
      label: "Theaters",
      description: "Add, update, and delete theaters.",
      icon: <Building2 size={28} color="#ef4444" />,
    },
  ];

  const handleComingSoon = (label: string) => {
    Alert.alert(`${label}`, "This page is coming soon!");
  };

  return (
    <ScrollView className="flex-1 bg-black px-6 pt-12">
      <Text className="text-white text-3xl font-bold mb-6">
        Admin Dashboard
      </Text>

      <View className="gap-5">
        {dashboardItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => {
              if (item.label === "Theaters") {
                router.push("/admin/theaters");
              } else {
                handleComingSoon(item.label);
              }
            }}
            className="flex-row items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 active:scale-95"
            activeOpacity={0.85}
          >
            <View className="p-3 bg-zinc-800 rounded-full">{item.icon}</View>
            <View className="flex-1">
              <Text className="text-white text-lg font-semibold">
                {item.label}
              </Text>
              <Text className="text-zinc-400 text-sm mt-1">
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;
