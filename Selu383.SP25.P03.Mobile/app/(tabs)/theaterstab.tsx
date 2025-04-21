import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { MapPin } from "lucide-react-native";

import TheaterCard from "@/components/TheaterCard";
import { useTheater } from "@/context/TheaterContext";
import { BASE_URL } from "@/constants/baseUrl";

type Theater = {
  id: number;
  name: string;
  address: string;
  seatCount: number;
};

const TheatersTab = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [filtered, setFiltered] = useState<Theater[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<string | null>(null);

  const { theater } = useTheater();

  useEffect(() => {
    const getCityAndTheaters = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        let userCity = null;

        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          const reverse = await Location.reverseGeocodeAsync(loc.coords);
          userCity = reverse[0]?.city?.toLowerCase().trim();
          setCity(reverse[0]?.city ?? null);
        }

        const res = await axios.get<Theater[]>(`${BASE_URL}/api/theaters`);
        let list = res.data;

        if (userCity) {
          list = [...list].sort((a, b) => {
            const aMatch = a.address.toLowerCase().includes(userCity) ? 1 : 0;
            const bMatch = b.address.toLowerCase().includes(userCity) ? 1 : 0;
            return bMatch - aMatch;
          });
        }

        setTheaters(list);
        setFiltered(list);
      } catch (err) {
        console.error("Error fetching theaters or location", err);
        Alert.alert("Error", "Could not fetch theaters.");
      } finally {
        setLoading(false);
      }
    };

    getCityAndTheaters();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(theaters);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        theaters.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.address.toLowerCase().includes(q)
        )
      );
    }
  }, [search, theaters]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="red" />
        <Text className="text-white mt-4">Loading theaters...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black px-4 pt-8">
      {/* Tab Title */}
      <View className="flex-row items-center gap-2 mb-4">
        <MapPin size={22} color="#ef4444" />
        <Text className="text-white text-2xl font-bold">Theaters</Text>
      </View>

      {/* Location Info */}
      {city && (
        <Text className="text-white mb-2 text-center text-sm">
          📍 Based on your location: <Text className="font-bold">{city}</Text>
        </Text>
      )}

      {/* Search Input */}
      <TextInput
        placeholder="Search by name or city..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
        className="bg-zinc-800 text-white px-4 py-2 rounded-lg mb-4"
      />

      {/* Theater List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TheaterCard theater={item} isSelected={item.id === theater?.id} />
        )}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-10">
            No theaters found.
          </Text>
        }
      />
    </View>
  );
};

export default TheatersTab;
