import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useRouter, useLocalSearchParams } from "expo-router";


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

function MoviePage() {
  const router = useRouter();
  const param = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("SHOWTIME");

  
  const movie = JSON.parse(param.movie as string) as Movie;
  console.log("Movie", movie)

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
      <View className="flex-row justify-center mt-4 ">
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
          
          
          <View className="flex-row flex-wrap gap-3">
            {['10:00 AM', '1:30 PM', '4:45 PM', '8:00 PM'].map((time) => (
              <TouchableOpacity
                key={time}
                className="bg-red-600 px-4 py-2 rounded-md"
                onPress={() => router.push('/(other)/seats')}
              >
                <Text className="text-white">{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
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