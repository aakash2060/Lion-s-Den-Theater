import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { movieService } from "../services/MovieApi";
import { MovieDetails } from "../Data/MovieInterfaces";

// Temporary trailer mappings until backend supports trailers
const trailerMappings: Record<number, string> = {
  1: "https://www.youtube.com/watch?v=YoHD9XEInc0", // Inception
  2: "https://www.youtube.com/watch?v=eOrNdBpGMv8", // The Avengers
  3: "https://www.youtube.com/watch?v=d9MyW72ELq0", // Avatar: The Way of Water
  4: "https://www.youtube.com/watch?v=mqqft2x_Aa4", // The Batman
  5: "https://www.youtube.com/watch?v=JfVOs4VSpmA", // Spider-Man: No Way Home
  6: "https://www.youtube.com/watch?v=8g18jFHCLXk", // Dune
  7: "https://www.youtube.com/watch?v=wxN1T1uxQ2g", // Everything Everywhere All at Once
  8: "https://www.youtube.com/watch?v=giXco2jaZ_4", // Top Gun: Maverick
  9: "https://www.youtube.com/watch?v=_Z3QKkl1WyM", // Black Panther: Wakanda Forever
  10: "https://www.youtube.com/watch?v=PLl99DlL6b4", // The Shawshank Redemption
  11: "https://www.youtube.com/watch?v=V75dMMIW2B4", // The Lord of the Rings: The Fellowship of the Ring
  12: "https://www.youtube.com/watch?v=5xH0HfJHsaY", // Parasite
  13: "https://www.youtube.com/watch?v=zSWdZVtXT7E", // Interstellar
  14: "https://www.youtube.com/watch?v=EXeTwQWrcwY", // The Dark Knight
  15: "https://www.youtube.com/watch?v=ByXuk9QqQkk", // Spirited Away
  16: "https://www.youtube.com/watch?v=vKQi3bBA1y8", // The Matrix
  17: "https://www.youtube.com/watch?v=s7EdQ4FqbhY", // Pulp Fiction
  18: "https://www.youtube.com/watch?v=xlnPHQ3TLX8", // Coco
  19: "https://www.youtube.com/watch?v=DzfpyUB60YY"  // Get Out
};

// Helper function to extract YouTube ID
const getYoutubeId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/);
  return match ? match[1] : null;
};




const MovieDescriptionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGetTickets = () => {
    // Scroll to showtimes section if available
    const showtimesElement = document.getElementById("tickets");
    if (showtimesElement) {
      showtimesElement.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate to booking page or show modal if no showtimes section
      navigate(`/showtimes/${id}`);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
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

        {movie.showtimes && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 hover:bg-red-700 transition px-8 py-4 rounded-xl text-lg font-semibold shadow-red-500 shadow-md"
              onClick={handleGetTickets}
            >
              🎟️ Get Tickets
            </motion.button>
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