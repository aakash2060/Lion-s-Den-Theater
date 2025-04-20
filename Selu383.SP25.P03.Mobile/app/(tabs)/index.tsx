import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MovieCard from "../../components/MovieCard";
import axios from "axios";
import { BASE_URL } from "@/constants/baseUrl";
import { useNavigation, useRouter } from "expo-router";

interface Movie {
  id: number;
  Title: string;
  description: string;
  posterUrl: string;
  releaseDate: string;
  genres: string[];
}

interface Showtime {
  id: number;
  movieId: number;
  theaterId: number;
  startTime: string;
  endTime: string;
}

const Home = () => {
  const [activeTab, setActiveTab] = useState("NOW PLAYING");
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);
  const navigation = useNavigation();
  const router = useRouter();
  const [featured, setFeatured] = useState<Movie[]>([]);

  const getSpringFeaturedMovies = (movies: Movie[]): Movie[] => {
    const springGenres = ["Romance", "Adventure", "Family", "Comedy"];
    
    // Convert all to lowercase once for case-insensitive comparison
    const springGenresLower = springGenres.map(g => g.toLowerCase());
    
    // Filter movies where any genre matches any spring genre
    const springMovies = movies.filter(movie => 
        movie.genres?.some(movieGenre => 
            springGenresLower.includes(movieGenre.toLowerCase())
        )
    );

    // Randomly pick 4-6 movies
    const shuffled = [...springMovies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(6, shuffled.length));
};

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all movies
        const moviesResponse = await axios.get(`${BASE_URL}/api/movies`);
        setAllMovies(moviesResponse.data);

        // Fetch showtimes for theater 2
        const showtimesResponse = await axios.get(
          `${BASE_URL}/api/showtimes/theater/2`
        );
        const currentShowtimes = showtimesResponse.data;

        // Create a Set of movie IDs that have showtimes in theater 2
        const showtimeMovieIds = new Set(
          currentShowtimes.map((showtime: Showtime) => showtime.movieId)
        );

        // Filter movies
        const nowShowingMovies = moviesResponse.data.filter((movie: Movie) =>
          showtimeMovieIds.has(movie.id)
        );

        const comingSoonMovies = moviesResponse.data.filter(
          (movie: Movie) => !showtimeMovieIds.has(movie.id)
        );

        const springFeatured = getSpringFeaturedMovies(moviesResponse.data);
        setFeatured(springFeatured);

        setNowShowing(nowShowingMovies);
        setComingSoon(comingSoonMovies);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again.");
        setAllMovies([]);
        setNowShowing([]);
        setComingSoon([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // handle search
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredMovies(allMovies);
      return;
    }

    const filtered = allMovies.filter(
      (movie) =>
        movie.Title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredMovies(filtered);
  };

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
            <Text
              className={`${
                activeTab === "NOW PLAYING" ? "text-blue-400" : "text-gray-400"
              } text-lg font-bold mr-6`}
            >
              NOW PLAYING
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("COMING SOON")}>
            <Text
              className={`${
                activeTab === "COMING SOON" ? "text-blue-400" : "text-gray-400"
              } text-lg font-bold mr-6`}
            >
              COMING SOON
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("Featured")}>
            <Text
              className={`${
                activeTab === "Featured" ? "text-blue-400" : "text-gray-400"
              } text-lg font-bold`}
            >
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
              marginTop: 16,
            }}
            renderItem={({ item }) => (
              <MovieCard
                Title={item.Title}
                PosterUrl={item.posterUrl}
                ReleaseDate={item.releaseDate}
                onPress={() => {
                  router.push({
                    pathname: "/(other)/movieDetails",
                    params: { movie: JSON.stringify(item) },
                  });
                }}
              />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text className="text-white text-center mt-10">
                No movies currently playing in this theater
              </Text>
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
              marginTop: 16,
            }}
            renderItem={({ item }) => (
              <MovieCard
                Title={item.Title}
                PosterUrl={item.posterUrl}
                ReleaseDate={item.releaseDate}
                onPress={() => {
                  router.push({
                    pathname: "/(other)/movieDetails",
                    params: { movie: JSON.stringify(item) },
                  });
                }}
              />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text className="text-white text-center mt-10">
                No upcoming movies
              </Text>
            }
          />
        )}

        {/* Featured Movies Section */}
        {/* Featured Section */}
        {activeTab === "Featured" && (
          <View className="px-4 pb-10">
            {/* Header */}
            <View className="bg-pink-50 rounded-lg p-4 mb-4">
              <Text className="text-2xl font-bold text-center text-pink-800">
                🌸 Spring Special 🌸
              </Text>
              <Text className="text-center text-pink-600 mt-1">
                Blossom into the season with these fresh picks!
              </Text>
            </View>

            {/* Movie Grid */}
            <FlatList
              data={featured}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{
                gap: 10,
                paddingHorizontal: 16,
                marginTop: 16,
              }}
              renderItem={({ item }) => (
                <View className="relative">
                  {/* Spring Badge */}
                  <View className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full z-10">
                    <Text className="text-pink-600 text-xs">
                      Spring Pick 🌸
                    </Text>
                  </View>

                  <MovieCard
                    Title={item.Title}
                    PosterUrl={item.posterUrl}
                    ReleaseDate={item.releaseDate}
                    onPress={() => {
                      router.push({
                        pathname: "/(other)/movieDetails",
                        params: { movie: JSON.stringify(item) },
                      });
                    }}
                  />
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <Text className="text-white text-center mt-10">
                  No spring features yet—check back soon!
                </Text>
              }
            />

            {/* Special Offer Banner */}
            <View className="bg-green-50 mt-6 p-3 rounded-lg border border-green-200">
              <Text className="text-green-800 font-bold text-center">
                🌿 Spring Promo: 2 tickets + popcorn = $20!
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;
