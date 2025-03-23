import { useParams } from "react-router-dom";
import movies from "../constants/movies.json";
import { motion } from "framer-motion";

const MovieDescriptionPage = () => {
  const { movieName } = useParams();
  const movie = movies.find(
    (m) => m.name.toLowerCase().replace(/\s+/g, "") === movieName?.toLowerCase().replace(/\s+/g, "")
  );

  if (!movie) return <div className="text-white p-10">Movie not found!</div>;

  // Extract video ID from YouTube URL for autoplay embed
  const youtubeId = movie.trailer.split("v=")[1]?.split("&")[0];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <h1 className="text-5xl font-bold text-center mb-2">{movie.name}</h1>
      <p className="text-center text-gray-400 italic mb-6">Official Trailer Preview</p>

      <div className="flex justify-center mb-10">
        {youtubeId ? (
          <div className="w-full max-w-screen-2xl aspect-video">
          <iframe
            className="w-full h-full border-none rounded-none"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
            title={`${movie.name} Trailer`}
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
        src={movie.image}
        alt={movie.name}
        className="mx-auto rounded-xl border-4 border-purple-500 shadow-xl w-64 mb-8 hover:scale-105 transition-transform"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      />

      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Description</h2>
        <p className="text-gray-300 mb-8 leading-relaxed">{movie.description}</p>

        <a href="#tickets">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 hover:bg-red-700 transition px-8 py-4 rounded-xl text-lg font-semibold shadow-red-500 shadow-md"
          >
            🎟️ Get Tickets
          </motion.button>
        </a>
      </div>
    </div>
  );
};

export default MovieDescriptionPage;