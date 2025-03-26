import { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";
import { movieService } from "../services/api";
import { Movie } from "../Data/MovieInterfaces";
import MovieCard from "../Components/MovieCard";

const SearchResults = () => {
  const { searchTerm } = useSearch();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await movieService.getAll();
        setMovies(data);
        setError(null);
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">
        Search results for "{searchTerm}"
      </h2>

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterUrl={movie.posterUrl}
              releaseDate={movie.releaseDate}
              genre={movie.genre}
              rating={movie.rating}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">
          No movies match your search.
        </div>
      )}
    </div>
  );
};

export default SearchResults;
