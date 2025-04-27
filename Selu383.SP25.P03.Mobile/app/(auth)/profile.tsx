import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { BASE_URL } from "@/constants/baseUrl";

interface Ticket {
  id: number;
  seatNumber: string;
  showtimeId: number;
  movieTitle: string;
  showtime: string;
  theaterName: string;
  showtimeStart: string;
}

const ProfileScreen = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth?.isAuthenticated) {
      getUserTickets();
    }
  }, [auth?.isAuthenticated]);

  const getUserTickets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${BASE_URL}/api/tickets`, { 
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await auth?.signout();
    router.replace("/");
  };

  if (!auth) return null;

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="p-4">
        {/* Profile Section */}
        <View className="bg-black bg-opacity-80 p-6 rounded-xl border border-gray-700 shadow-lg items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-gray-700 border-4 border-gray-500 flex items-center justify-center shadow-md mb-4">
            <Text className="text-3xl font-bold text-white">
              {auth.user?.userName?.charAt(0)?.toUpperCase()}
            </Text>
          </View>

          <Text className="text-xl font-bold text-red-500">{auth.user?.userName}</Text>
          <Text className="text-red-400 text-sm mt-1">{auth.user?.roles?.join(", ")}</Text>

          <TouchableOpacity
            onPress={handleSignOut}
            className="mt-6 flex-row items-center bg-red-600 px-5 py-3 rounded-lg shadow-lg"
          >
            <FontAwesome name="sign-out" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Tickets Section */}
        <View className="bg-black bg-opacity-80 p-4 rounded-xl border border-gray-700">
          <Text className="text-xl font-bold text-white mb-4">My Tickets</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#ef4444" />
          ) : error ? (
            <View className="items-center py-4">
              <Text className="text-red-500">{error}</Text>
              <TouchableOpacity 
                onPress={getUserTickets}
                className="mt-2 bg-red-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : tickets.length === 0 ? (
            <Text className="text-gray-400 text-center py-4">No tickets found</Text>
          ) : (
            tickets.map(ticket => (
              <View key={ticket.id} className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <Text className="text-lg font-bold text-white">{ticket.movieTitle}</Text>
                <View className="flex-row justify-between mt-2">
                  <Text className="text-gray-300">Seat: {ticket.seatNumber}</Text>
                  <Text className="text-gray-300">Theater: {ticket.theaterName}</Text>
                </View>
                <Text className="text-gray-300 mt-1">Showtime: {ticket.showtimeStart}</Text>
                
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;