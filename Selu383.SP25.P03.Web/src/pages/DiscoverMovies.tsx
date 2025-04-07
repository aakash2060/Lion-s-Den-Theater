import { useState, useEffect } from "react";
import { useTheater } from "../context/TheaterContext";
import MovieCard from "../Components/MovieCard";
import QRCard from "../Components/QRCard";
import { showtimeService } from "../services/ShowtimeApi";
import { movieService } from "../services/api";
import { Movie } from "../Data/MovieInterfaces";
import { Showtime } from "../Data/ShowtimeInterfaces";

const DiscoverMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("now_showing"); // ✅ Default is "Now Showing"
  const [sortOption, setSortOption] = useState("rating");
  const [hoveredMovie, setHoveredMovie] = useState<string | null>(null);

  const { theater } = useTheater();

  useEffect(() => {
    const fetchData = async () => {
      if (!theater) return;
      try {
        setLoading(true);
        const [movieData, showtimeData] = await Promise.all([
          movieService.getAll(theater.id.toString()),
          showtimeService.getByTheaterId(theater.id),
        ]);
        setMovies(movieData);
        setShowtimes(showtimeData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [theater]);

  const movieIdsWithShowtimes = new Set(showtimes.map((s) => s.movieId));

  const getFilteredMovies = () => {
    if (filter === "All") return movies;
    if (filter === "now_showing") {
      return movies.filter((movie) => movieIdsWithShowtimes.has(movie.id));
    }
    if (filter === "upcoming") {
      return movies.filter((movie) => !movieIdsWithShowtimes.has(movie.id));
    }
    return movies.filter((movie) => movie.genre === filter);
  };

  const filteredMovies = getFilteredMovies();

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortOption === "rating") {
      return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
    }
    if (sortOption === "duration") {
      return b.duration - a.duration;
    }
    if (sortOption === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  if (!theater) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-xl">
        🎬 Please select a theater from the top dropdown or theater page to see available movies.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">🎬 Discover Movies</h1>
        <p className="mt-2 text-lg text-gray-400">
          Showing movies at <span className="text-red-400 font-semibold">{theater.name}</span>
        </p>
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-wrap justify-between mt-6 gap-4">
        {/* Genre Filters */}
        <select
          className="p-2 bg-gray-800 text-white rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="now_showing">Now Showing</option>
          <option value="All">All Movies</option>
          <option value="upcoming">Upcoming</option>
          {Array.from(new Set(movies.map((movie) => movie.genre))).map(
            (genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            )
          )}
        </select>

        {/* Sorting Options */}
        <select
          className="p-2 bg-gray-800 text-white rounded"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="rating">Highest Rated</option>
          <option value="duration">Longest Duration</option>
          <option value="alphabetical">Alphabetical (A → Z)</option>
        </select>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
        {sortedMovies.map((movie) => (
          <div
            key={movie.id}
            className="relative"
            onMouseEnter={() => setHoveredMovie(movie.title)}
            onMouseLeave={() => setHoveredMovie(null)}
          >
            <MovieCard
              id={movie.id}
              title={movie.title}
              posterUrl={movie.posterUrl}
              releaseDate={movie.releaseDate}
              genre={movie.genre}
              rating={movie.rating}
            />
            {hoveredMovie === movie.title && (
              <div className="absolute top-0 left-0 bg-gray-900 text-white p-2 rounded-md">
                {movie.title}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Featured Section */}
      <div className="mt-12 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl font-bold">🍿 Making Your Moments Special</h2>
          <p className="text-gray-400 mt-2">
            Lion's Den is the place we go for magic, where stories feel perfect
            and powerful. Academy Award® winner Nicole Kidman reveals why movies
            are better here than anywhere else.
          </p>
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0">
          <iframe
            className="w-full max-w-2xl h-64 md:h-96"
            src="https://www.youtube.com/embed/Way9Dexny3w"
            title="youtube-trailer-openhiemer"
            allow="autoplay; picture-in-picture;"
            allowFullScreen
          />
        </div>
      </div>

      {/* QR Code for App Download */}
      <div className="flex justify-center mt-10 mb-10">
        <QRCard />
      </div>
    </div>
  );
};

export default DiscoverMovies;
