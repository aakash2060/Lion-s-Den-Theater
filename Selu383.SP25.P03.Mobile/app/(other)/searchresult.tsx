import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, SafeAreaView } from "react-native";
import axios from "axios";
import { useSearch } from "@/context/SearchContext";
import { BASE_URL } from "@/constants/baseUrl";
import MovieCard from "@/components/MovieCard";
import { useRouter } from "expo-router";

type BackendMovie = {
  id: number;
  title: string;
  posterUrl: string;
  duration?: string;
  releaseDate: string;
  description?: string;
  director?: string;
  genre?: string;
  trailerId?: string;
};

const SearchResult = () => {
  const { query } = useSearch();
  const [results, setResults] = useState<BackendMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get<BackendMovie[]>(`${BASE_URL}/api/movies`);
        const filtered = res.data.filter((movie) =>
          movie.title.toLowerCase().trim().includes(query.toLowerCase().trim())
        );

        setResults(filtered);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <SafeAreaView className="flex-1 bg-black px-4 py-12">
    <View >
      <Text className="text-white text-xl font-bold mb-4">
        Search Results for "{query}"
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => {
            const fallback =
              "https://via.placeholder.com/200x300?text=No+Image";
            const isFullUrl = item.posterUrl?.startsWith("http");
            const imageUrl = item.posterUrl
              ? isFullUrl
                ? item.posterUrl
                : `${BASE_URL}${item.posterUrl}`
              : fallback;

            return (
              <MovieCard
                Title={item.title}
                PosterUrl={imageUrl}
                ReleaseDate={item.releaseDate}
                onPress={() => {
                  router.push({
                    pathname: "/(other)/movieDetails",
                    params: {
                      movie: JSON.stringify(item),
                    },
                  } as any);
                }}
              />
            );
          }}
          ListEmptyComponent={
            <Text className="text-gray-400 text-center mt-6">
              No results found.
            </Text>
          }
        />
      )}
    </View>
    </SafeAreaView>
  );
};

export default SearchResult;
