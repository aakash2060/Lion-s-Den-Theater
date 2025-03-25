import MovieCarousel from "../Components/MovieCarousel";
import { useState, useEffect } from "react";
import MovieCard from "../Components/MovieCard";
import { useNavigate } from "react-router-dom";
import { movieService } from "../services/api";
import { Movie } from "../Data/MovieInterfaces";

const Home = () => {
  const navigate = useNavigate();
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
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Filter movies into categories
  const nowShowing = movies.filter(
    (movie) => new Date(movie.releaseDate) <= new Date()
  );
  const comingSoon = movies.filter(
    (movie) => new Date(movie.releaseDate) > new Date()
  );
  const topRated = [...movies]
    .filter((movie) => movie.rating) // Ensure rating exists
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)) // Sort by rating (highest first)
    .slice(0, 5); // Show top 5 rated movies

  // Function to scroll to section
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <MovieCarousel />

      {/* Navigation Tabs - Aligned to Left */}
      <div className="flex justify-start space-x-8 text-lg font-bold ml-10 mt-6">
        <button
          onClick={() => scrollToSection("nowPlaying")}
          className="text-red-500"
        >
          🎬 Now Playing
        </button>
        <button
          onClick={() => scrollToSection("comingSoon")}
          className="text-blue-500"
        >
          🚀 Coming Soon
        </button>
        <button
          onClick={() => scrollToSection("topRated")}
          className="text-yellow-500"
        >
          ⭐ Top Rated
        </button>
      </div>

      {/* Loading and Error Handling */}
      {loading && <div className="text-center py-10">Loading movies...</div>}
      {error && <div className="text-center py-10 text-red-500">{error}</div>}

      {/* Now Playing Section */}
      <section id="nowPlaying" className="container mx-auto py-10">
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-900 px-4 text-lg font-semibold text-white">
              🎬 Now Playing
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {nowShowing.length > 0 ? (
            nowShowing.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterUrl={movie.posterUrl}
                releaseDate={movie.releaseDate}
                genre={movie.genre}
                rating={movie.rating}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              No movies currently Showing
            </div>
          )}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section id="comingSoon" className="container mx-auto py-10">
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-900 px-4 text-lg font-semibold text-white">
              🚀 Coming Soon
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {comingSoon.length > 0 ? (
            comingSoon.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterUrl={movie.posterUrl}
                releaseDate={movie.releaseDate}
                genre={movie.genre}
                rating={movie.rating}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              No Upcoming movies Scheduled
            </div>
          )}
        </div>
      </section>

      {/* Top Rated Section */}
      <section id="topRated" className="container mx-auto py-10">
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-900 px-4 text-lg font-semibold text-white">
              ⭐ Top Rated
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {topRated.length > 0 ? (
            topRated.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterUrl={movie.posterUrl}
                releaseDate={movie.releaseDate}
                genre={movie.genre}
                rating={movie.rating}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              No rated movies available
            </div>
          )}
        </div>
      </section>

      {/* Exclusive Offers & Membership */}
      <section className="bg-[#7c0000] p-10 text-center mt-16">
        <h2 className="text-3xl font-bold">
          Get early access, discounts, and more with Lion’s Den Plus.
        </h2>
        <p className="mt-2">Unlock unlimited movies and exclusive perks.</p>

        {/* Fixed Join Now Button */}
        <button
          onClick={() => navigate("/register")}
          className="mt-4 px-6 py-2 bg-white text-red-600 font-bold rounded-md hover:bg-red-100 transition duration-300"
        >
          Join Now
        </button>
      </section>
    </div>
  );
};

export default Home;
