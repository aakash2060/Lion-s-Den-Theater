import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Building2, MapPin, Armchair } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheater } from "@/context/TheaterContext";

type Props = {
  theater: {
    id: number;
    name: string;
    address: string;
    seatCount: number;
  };
  isSelected?: boolean; 
};

const TheaterCard: React.FC<Props> = ({ theater, isSelected = false }) => {
  const router = useRouter();
  const { setTheater } = useTheater();

  return (
    <View
      className={`p-4 rounded-xl mb-4 border ${
        isSelected ? "border-red-500 bg-zinc-800" : "border-zinc-700 bg-zinc-900"
      }`}
    >
      {/* Name */}
      <View className="flex-row items-center gap-2 mb-1">
        <Building2 size={18} color="#f87171" />
        <Text className="text-white text-lg font-bold">{theater.name}</Text>
      </View>

      {/* Address */}
      <View className="flex-row items-center gap-2 mb-1">
        <MapPin size={16} color="#f87171" />
        <Text className="text-gray-400">{theater.address}</Text>
      </View>

      {/* Seat Count */}
      <View className="flex-row items-center gap-2 mb-4">
        <Armchair size={16} color="#60a5fa" />
        <Text className="text-gray-400">Seats: {theater.seatCount}</Text>
      </View>

      {/* Buttons */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => {
            setTheater(theater);
            router.push("/");
          }}
          className="bg-red-600 flex-1 px-3 py-2 rounded-lg active:scale-95"
        >
          <Text className="text-white text-center font-semibold">🎬 Movies</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert("Coming Soon", `Details for ${theater.name}`)}
          className="border border-zinc-600 flex-1 px-3 py-2 rounded-lg active:scale-95"
        >
          <Text className="text-zinc-300 text-center font-semibold">🏛️ Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TheaterCard;
