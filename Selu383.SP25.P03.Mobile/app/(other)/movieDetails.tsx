import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import * as Location from "expo-location";
import { useTheater } from "@/context/TheaterContext";
import { BASE_URL } from "@/constants/baseUrl";
import { useBooking } from "@/context/BookingContext";

type Movie = {
  id: number;
  title: string;
  description: string;
  director: string;
  duration: string;
  posterUrl: string;
  releaseDate: string;
  genre: string;
  trailerId: string;
};

type ShowtimeDto = {
  id: number;
  movieId: number;
  theaterId: number;
  startTime: string;
  endTime: string;
  price: number;
  is3D: boolean;
  hallNumber: number;
};

export default function MoviePage() {
  const router = useRouter();
  const param = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("SHOWTIME");

  const { theater } = useTheater();
  const [showtimes, setShowtimes] = useState<ShowtimeDto[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const movie = JSON.parse(param.movie as string) as Movie;

  const formatDateKey = (date: Date) => date.toISOString().split("T")[0];
  const { setCurrentShowtime, setCurrentMovie } = useBooking();

  const getDateOptions = () => {
    const today = new Date();
    return Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        label:
          i === 0
            ? "Today"
            : i === 1
            ? "Tomorrow"
            : d.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
        key: formatDateKey(d),
      };
    });
  };

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!movie?.id) return;
      try {
        const res = await axios.get(
          `${BASE_URL}/api/showtimes/movie/${movie.id}`
        );
        const filtered = theater
          ? res.data.filter((s: ShowtimeDto) => s.theaterId === theater.id)
          : res.data;
        setShowtimes(filtered);

        if (filtered.length > 0 && !selectedDate) {
          const first = new Date(filtered[0].startTime);
          setSelectedDate(formatDateKey(first));
        }
      } catch (err) {
        console.error(" Failed to fetch showtimes", err);
      }
    };
    fetchShowtimes();
  }, [movie, theater]);

  useEffect(() => {
    const getCity = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const loc = await Location.getCurrentPositionAsync({});
        const reverse = await Location.reverseGeocodeAsync(loc.coords);
        if (reverse[0]?.city) {
          setCity(reverse[0].city);
        }
      } catch (err) {
        console.warn(" Failed to get city", err);
      }
    };
    getCity();
  }, []);

  const dateOptions = getDateOptions();
  const filteredShowtimes = showtimes.filter(
    (s) => formatDateKey(new Date(s.startTime)) === selectedDate
  );

  return (
    <ScrollView className="bg-black">
      {/* Trailer */}
      <View className="h-56 bg-black mt-20 mb-6">
        <YoutubePlayer height={224} play={false} videoId={movie.trailerId} />
      </View>

      {/* Location Info */}
      <View className="items-center mt-6">
        {city && (
          <Text className="text-gray-400 text-sm text-center">
            Based on your location:{" "}
            <Text className="text-white font-semibold">{city}</Text>
          </Text>
        )}
        {theater && (
          <Text className="text-gray-400 text-sm mt-1 text-center">
            Nearest Theater:{" "}
            <Text className="text-white font-semibold">{theater.name}</Text>
          </Text>
        )}
      </View>

      {/* Tabs */}
      <View className="flex-row justify-center mt-6">
        {["SHOWTIME", "DETAILS"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`pb-3 px-6 ${
              activeTab === tab ? "border-b-2 border-red-600" : ""
            }`}
          >
            <Text
              className={`text-lg font-bold ${
                activeTab === tab ? "text-red-600" : "text-gray-500"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SHOWTIME Tab */}
      {activeTab === "SHOWTIME" && (
        <View className="p-5">
          {/* Date Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4 px-2"
            contentContainerStyle={{ gap: 8 }}
          >
            {dateOptions.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => setSelectedDate(opt.key)}
                className={`px-4 py-2 rounded-full ${
                  selectedDate === opt.key ? "bg-red-600" : "bg-zinc-800"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedDate === opt.key ? "text-white" : "text-gray-300"
                  }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {theater && (
            <Text className="text-white text-lg font-bold mb-4 text-center">
              🎬 Showtimes at {theater.name}
            </Text>
          )}

          {/* Showtimes */}
          {filteredShowtimes.length === 0 ? (
            <Text className="text-gray-400 text-center mt-10">
              No showtimes available for this date.
            </Text>
          ) : (
            <View className="flex flex-wrap gap-4">
              {filteredShowtimes.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  onPress={() =>{
                    setCurrentShowtime(s)
                    setCurrentMovie(movie)
                    router.push({
                      pathname: "/(other)/seats",
                      params: { 
                        showtime: JSON.stringify(s),
                        movie: JSON.stringify(movie)
                      }
                    })
                  }
                }
                  className="bg-zinc-900 p-4 rounded-xl border border-zinc-700 w-full"
                >
                  <Text className="text-white text-xl font-bold">
                    {new Date(s.startTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Hall: {s.hallNumber}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Format: {s.is3D ? "3D" : "2D"}
                  </Text>
                  <Text className="text-red-500 font-bold mt-1">
                    🎟️ ${s.price.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* DETAILS Tab */}
      {activeTab === "DETAILS" && (
        <View className="p-5">
          <View className="flex-row">
            <Image
              source={{ uri: movie.posterUrl }}
              className="w-32 h-48 rounded-lg"
              resizeMode="contain"
            />
            <View className="ml-4 flex-1">
              <Text className="text-2xl font-bold text-white">
                {movie.title}
              </Text>
              <Text className="text-white text-sm mt-1">{movie.duration}</Text>
              <Text className="text-white text-sm italic mt-1">
                {movie.genre}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-xl font-bold mb-3 text-white">Synopsis</Text>
            <Text className="text-white">{movie.description}</Text>

            <Text className="text-xl font-bold mt-6 mb-3 text-white">
              Director
            </Text>
            <Text className="text-white">{movie.director}</Text>

            <Text className="text-xl font-bold mt-6 mb-3 text-white">
              Release Date
            </Text>
            <Text className="text-white">{movie.releaseDate}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
