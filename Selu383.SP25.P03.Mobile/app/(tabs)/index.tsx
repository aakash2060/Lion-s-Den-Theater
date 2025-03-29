import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import MovieCard from "../../components/MovieCard";
import axios from "axios";
import { BASE_URL } from "@/constants/baseUrl";



interface Movie {
    id: number;
    title: string; 
    description: string;
    posterUrl: string;
    releaseDate: string;  
    
}

const Home = () => {
    const [activeTab, setActiveTab] = useState("NOW PLAYING");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch movies from API
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/api/movies`);
                setMovies(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch movies:", err);
                setError("Failed to load movies. Please try again.");
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // handle search
    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setFilteredMovies(movies);
            return;
        }
        
        
        const filtered = movies.filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase()) ||
            movie.description.toLowerCase().includes(query.toLowerCase())
        );
        
        setFilteredMovies(filtered);
    };

    // Filter movies based on active tab
    const nowShowing = movies.filter(movie => new Date(movie.releaseDate) <= new Date());
    const comingSoon = movies.filter(movie => new Date(movie.releaseDate) > new Date());

    if (loading) {
        return (
            <View className="bg-black flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="bg-black flex-1 justify-center items-center">
                <Text className="text-white text-lg">{error}</Text>
                <TouchableOpacity 
                    className="mt-4 bg-blue-500 px-4 py-2 rounded"
                    onPress={() => window.location.reload()}
                >
                    <Text className="text-white">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="bg-black flex-1">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Navigation Tabs */}
                <View className="flex-row justify-start px-5 mt-6">
                    <TouchableOpacity onPress={() => setActiveTab("NOW PLAYING")}>
                        <Text className={`${activeTab === "NOW PLAYING" ? "text-blue-400" : "text-gray-400"} text-lg font-bold mr-6`}>
                            NOW PLAYING
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab("COMING SOON")}>
                        <Text className={`${activeTab === "COMING SOON" ? "text-blue-400" : "text-gray-400"} text-lg font-bold mr-6`}>
                            COMING SOON
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab("Featured")}>
                        <Text className={`${activeTab === "Featured" ? "text-blue-400" : "text-gray-400"} text-lg font-bold`}>
                           Featured
                        </Text>
                    </TouchableOpacity>
                </View>
                
                {/* Now Playing Section */}
                {activeTab === "NOW PLAYING" && (
                    <FlatList
                        data={nowShowing}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        scrollEnabled={false}
                        columnWrapperStyle={{
                            gap: 10,
                            paddingHorizontal: 16,
                            marginTop: 16
                        }}
                        renderItem={({ item }) => (
                            <MovieCard 
                                name={item.title}  
                                image={item.posterUrl}
                                releaseDate={item.releaseDate}
                                
                            />
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={
                            <Text className="text-white text-center mt-10">No movies currently playing</Text>
                        }
                    />
                )}
                
                {/* Coming Soon Section */}
                {activeTab === "COMING SOON" && (
                    <FlatList
                        data={comingSoon}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        scrollEnabled={false}
                        columnWrapperStyle={{
                            gap: 10,
                            paddingHorizontal: 16,
                            marginTop: 16
                        }}
                        renderItem={({ item }) => (
                            <MovieCard 
                                name={item.title}  
                                image={item.posterUrl}
                                releaseDate={item.releaseDate}
                               
                            />
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={
                            <Text className="text-white text-center mt-10">No upcoming movies</Text>
                        }
                    />
                )}
            </ScrollView>
        </View>
    );
};

export default Home;