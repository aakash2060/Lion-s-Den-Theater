import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { BASE_URL } from "@/constants/baseUrl";
import axios from "axios";
import TheaterCard from "@/components/TheaterCard";
import { useTheater } from "@/context/TheaterContext";
import { MapPin } from "lucide-react-native";

type Theater = {
  id: number;
  name: string;
  address: string;
  seatCount: number;
  latitude?: number;
  longitude?: number;
};

const TheatersTab = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [filtered, setFiltered] = useState<Theater[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const { setTheater } = useTheater();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Location Denied",
            "We need location to show nearby theaters."
          );
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });

        const res = await axios.get(`${BASE_URL}/api/theaters`);
        setTheaters(res.data);
        setFiltered(res.data);
      } catch (err) {
        Alert.alert("Error", "Could not fetch theaters.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
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

  const renderItem = ({ item }: { item: Theater }) => (
    <TheaterCard theater={item} />
  );

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
        renderItem={renderItem}
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
