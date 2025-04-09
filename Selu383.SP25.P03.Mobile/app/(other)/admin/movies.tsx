import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
import axios from "axios";
import { PencilLine, Trash2, Plus } from "lucide-react-native";
import { BASE_URL } from "@/constants/baseUrl";
import MovieCard from "@/components/MovieCard";

type Movie = {
  id?: number;
  title: string;
  description: string;
  director: string;
  duration: number;
  rating: string;
  genre: string;
  posterUrl: string;
  releaseDate: string;
  trailerId: string;
};

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2; // assuming 24px padding on both sides

const API_BASE = `${BASE_URL}/api/movies`;

const AdminMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Movie>({
    title: "",
    description: "",
    director: "",
    duration: 0,
    rating: "",
    genre: "",
    posterUrl: "",
    releaseDate: new Date().toISOString().split("T")[0],
    trailerId: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(API_BASE);
      setMovies(res.data);
    } catch (err) {
      console.error("Failed to fetch movies", err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id: number) => {
    Alert.alert("Confirm Delete", "Delete this movie?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE}/${id}`);
            fetchMovies();
          } catch (err) {
            Alert.alert("Error", "Could not delete movie.");
          }
        },
      },
    ]);
  };

  const handleEdit = (movie: Movie) => {
    setFormData({ ...movie });
    setEditingId(movie.id ?? null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.genre ||
      !formData.posterUrl ||
      !formData.releaseDate
    ) {
      Alert.alert("Invalid Data", "Please fill required fields.");
      return;
    }

    try {
      if (editingId !== null) {
        await axios.put(`${API_BASE}/${editingId}`, formData);
      } else {
        await axios.post(API_BASE, formData);
      }

      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        director: "",
        duration: 0,
        rating: "",
        genre: "",
        posterUrl: "",
        releaseDate: new Date().toISOString().split("T")[0],
        trailerId: "",
      });
      setEditingId(null);
      fetchMovies();
    } catch (err) {
      Alert.alert("Error", "Failed to submit movie.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-4 pt-10">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white text-3xl font-bold">Manage Movies</Text>
        <TouchableOpacity
          className="bg-red-600 p-2 rounded-full"
          onPress={() => {
            setFormData({
              title: "",
              description: "",
              director: "",
              duration: 0,
              rating: "",
              genre: "",
              posterUrl: "",
              releaseDate: new Date().toISOString().split("T")[0],
              trailerId: "",
            });
            setEditingId(null);
            setShowModal(true);
          }}
        >
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 20,
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item: movie }) => (
          <View style={{ width: cardWidth }}>
            {/* Movie Card */}
            <MovieCard
              Title={movie.title}
              PosterUrl={movie.posterUrl}
              ReleaseDate={movie.releaseDate}
              onPress={() => handleEdit(movie)} // optional
            />

            {/* Buttons below card */}
            <View className="flex-row justify-between mt-2 gap-2">
              <TouchableOpacity
                onPress={() => handleEdit(movie)}
                className="bg-red-600 px-3 py-2 rounded-lg flex-1 flex-row items-center justify-center"
              >
                <PencilLine size={18} color="white" />
                <Text className="text-white ml-2">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(movie.id!)}
                className="border border-red-600 px-3 py-2 rounded-lg flex-1 flex-row items-center justify-center"
              >
                <Trash2 size={18} color="#ef4444" />
                <Text className="text-red-500 ml-2">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={showModal} transparent animationType="slide">
        <View className="flex-1 justify-center bg-black/90 px-6">
          <View className="bg-zinc-800 rounded-xl p-6">
            <Text className="text-white text-xl font-bold mb-4">
              {editingId ? "Edit Movie" : "Add Movie"}
            </Text>

            {[
              { label: "Title", key: "title" },
              { label: "Description", key: "description" },
              { label: "Director", key: "director" },
              {
                label: "Duration (in mins)",
                key: "duration",
                keyboard: "numeric",
              },
              { label: "Rating", key: "rating" },
              { label: "Genre", key: "genre" },
              { label: "Poster URL", key: "posterUrl" },
              { label: "Release Date (YYYY-MM-DD)", key: "releaseDate" },
              { label: "Trailer ID", key: "trailerId" },
            ].map(({ label, key, keyboard }) => (
              <TextInput
                key={key}
                placeholder={label}
                placeholderTextColor="#a1a1aa"
                value={formData[key as keyof Movie]?.toString() || ""}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    [key]: keyboard === "numeric" ? parseInt(text) || 0 : text,
                  })
                }
                keyboardType={keyboard as any}
                className="bg-zinc-900 text-white p-3 rounded mb-3"
              />
            ))}

            <View className="flex-row justify-end space-x-3 mt-2">
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
                className="border border-zinc-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-zinc-300">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">
                  {editingId ? "Update" : "Add"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminMovies;
