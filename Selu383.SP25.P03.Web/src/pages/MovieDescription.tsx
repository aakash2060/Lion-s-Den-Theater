import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { movieService } from "../services/api";

// Temporary trailer mappings until backend supports trailers
const trailerMappings: Record<number, string> = {
  1: "https://www.youtube.com/watch?v=KZ-ktTJjMYE",
  2: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  // Add more mappings as needed
};

// Helper function to extract YouTube ID
const getYoutubeId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/);
  return match ? match[1] : null;
};

// Define the movie interface to match your API
interface MovieDetails {
  id: number;
  title: string;
  description: string;
  director: string;
  duration: number;
  rating: string;
  genre: string;
  posterUrl: string;
  releaseDate: string;
  showtimes?: any[]; // Add the showtimes property if your API returns it
}

const MovieDescriptionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const movieData = await movieService.getById(parseInt(id, 10));
        setMovie(movieData);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading movie details...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-xl text-red-500">{error || "Movie not found"}</div>
      </div>
    );
  }

  // Get trailer from mappings or use fallback
  const trailerUrl = movie.id ? trailerMappings[movie.id] : null;
  const youtubeId = trailerUrl ? getYoutubeId(trailerUrl) : "KZ-ktTJjMYE"; // Fallback to a generic trailer

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <h1 className="text-5xl font-bold text-center mb-2">{movie.title}</h1>
      <p className="text-center text-gray-400 italic mb-6">Official Trailer Preview</p>

      <div className="flex justify-center mb-10">
        {youtubeId ? (
          <div className="w-full max-w-screen-2xl aspect-video">
            <iframe
              className="w-full h-full border-none rounded-none"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
              title={`${movie.title} Trailer`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="bg-gray-800 w-full max-w-4xl h-64 flex items-center justify-center rounded-2xl shadow-xl">
            <p className="text-gray-400">Trailer unavailable</p>
          </div>
        )}
      </div>

      <motion.img
        src={movie.posterUrl}
        alt={movie.title}
        className="mx-auto rounded-xl border-4 border-purple-500 shadow-xl w-64 mb-8 hover:scale-105 transition-transform"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        onError={(e) => {
          e.currentTarget.src = "/images/placeholder-poster.jpg"; // Fallback image
        }}
      />

      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center gap-4 mb-4">
          <span className="px-3 py-1 bg-red-600 rounded-full text-sm">
            {movie.genre}
          </span>
          <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
            {movie.duration} min
          </span>
          <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
            {new Date(movie.releaseDate).getFullYear()}
          </span>
          {movie.rating && (
            <span className="px-3 py-1 bg-yellow-600 rounded-full text-sm">
              Rating: {movie.rating}
            </span>
          )}
        </div>

        <h2 className="text-3xl font-bold mb-4">Description</h2>
        <p className="text-gray-300 mb-8 leading-relaxed">{movie.description}</p>

        {/* Add director info */}
        <h2 className="text-2xl font-bold mb-2">Director</h2>
        <p className="text-gray-300 mb-8">{movie.director}</p>

        {/* Show showtimes if available */}
        {movie.showtimes && movie.showtimes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" id="tickets">Available Showtimes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {movie.showtimes.map(showtime => (
                <div key={showtime.id} className="bg-gray-800 p-4 rounded-lg text-left">
                  <p className="font-bold">{showtime.theaterName}</p>
                  <p className="text-sm">
                    {new Date(showtime.startTime).toLocaleString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm">Hall {showtime.hallNumber} | {showtime.is3D ? '3D' : '2D'}</p>
                  <p className="text-sm">Price: ${showtime.price.toFixed(2)}</p>
                  <p className="text-sm mb-2">Available Seats: {showtime.availableSeats}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm w-full"
                    onClick={() => navigate(`/booking/${showtime.id}`)}
                  >
                    Book Tickets
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!movie.showtimes && (
          <a href="#tickets">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 hover:bg-red-700 transition px-8 py-4 rounded-xl text-lg font-semibold shadow-red-500 shadow-md"
            >
              🎟️ Get Tickets
            </motion.button>
          </a>
        )}

        <div className="mt-8">
          <button 
            onClick={() => navigate(-1)} 
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition"
          >
            ← Back to Movies
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDescriptionPage;