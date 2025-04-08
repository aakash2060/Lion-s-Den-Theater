import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BASE_URL } from "@/constants/baseUrl";


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
type Showtime = {
  id: number;
  time: string;
  theater: {
    id: number;
    name: string;
    location: string;
  };
};

export const fetchShowtimesByMovie = async (movieId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/api/showtimes/movie/${movieId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    return [];
  }
};
function MoviePage() {
  const router = useRouter();
  const param = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("SHOWTIME");
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const movie = JSON.parse(param.movie as string) as Movie;
  
  useEffect(() => {
    const loadShowtimes = async () => {
      try {
        const data = await fetchShowtimesByMovie(movie.id);
        setShowtimes(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load showtimes");
        setLoading(false);
      }
    };

    if (activeTab === "SHOWTIME") {
      loadShowtimes();
    }
  }, [activeTab, movie.id]);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView>
      <View className="h-56 bg-black mt-20">
        <YoutubePlayer
          height={224}
          play={false}
          videoId={movie.trailerId}
        />
      </View>

      {/* Navigation Tabs */}
      <View className="flex-row justify-center mt-4">
        <TouchableOpacity 
          onPress={() => setActiveTab("SHOWTIME")}
          className={`pb-3 px-6 ${activeTab === "SHOWTIME" ? "border-b-2 border-red-600" : ""}`}
        >
          <Text className={`text-lg font-bold ${activeTab === "SHOWTIME" ? "text-red-600" : "text-gray-500"}`}>
            Showtime
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setActiveTab("DETAILS")}
          className={`pb-3 px-6 ${activeTab === "DETAILS" ? "border-b-2 border-red-600" : ""}`}
        >
          <Text className={`text-lg font-bold ${activeTab === "DETAILS" ? "text-red-600" : "text-gray-500"}`}>
            Details
          </Text>
        </TouchableOpacity>
      </View>

      {/* Showtime Tab Content */}
      {activeTab === "SHOWTIME" && (
        <View className="p-5">
          <Text className="text-xl font-bold mb-4 text-white">Available Showtimes</Text>
          
          {loading ? (
            <Text className="text-white">Loading showtimes...</Text>
          ) : error ? (
            <Text className="text-red-500">{error}</Text>
          ) : showtimes.length === 0 ? (
            <Text className="text-white">No showtimes available</Text>
          ) : (
            <>
              {/* Group showtimes by theater */}
              {Array.from(new Set(showtimes.map(s => s.theater.id))).map(theaterId => {
                const theater = showtimes.find(s => s.theater.id === theaterId)?.theater;
                const theaterShowtimes = showtimes.filter(s => s.theater.id === theaterId);
                
                return (
                  <View key={theaterId} className="mb-6">
                    <Text className="text-lg font-bold text-white">{theater?.name}</Text>
                    <Text className="text-gray-400 text-sm mb-2">{theater?.location}</Text>
                    
                    <View className="flex-row flex-wrap gap-3">
                      {theaterShowtimes.map(showtime => (
                        <TouchableOpacity
                          key={showtime.id}
                          className="bg-red-600 px-4 py-2 rounded-md"
                          onPress={() => router.push({
                            pathname: '/(other)/seats',
                            params: { showtimeId: showtime.id }
                          })}
                        >
                          <Text className="text-white">{formatTime(showtime.time)}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </View>
      )}

      {/* Details Tab Content */}
      {activeTab === "DETAILS" && (
        <View className="p-5">
          <View className="flex-row">
            <Image
              source={{ uri: movie.posterUrl }} 
              className="w-32 h-48 rounded-lg"
              resizeMode="contain"
            />
            <View className="ml-4 flex-1">
              <Text className="text-2xl font-bold text-white">{movie.title}</Text>
              <View className="flex-row items-center mt-2">
                <Text className="text-white text-sm">{movie.duration}</Text>
              </View>
              <Text className="text-white text-sm italic mt-1">
                {movie.genre}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-xl font-bold mb-3 text-white">Synopsis</Text>
            <Text className="text-white">{movie.description}</Text>
            
            <Text className="text-xl font-bold mt-6 mb-3 text-white">Director</Text>
            <Text className="text-white">{movie.director}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

export default MoviePage;