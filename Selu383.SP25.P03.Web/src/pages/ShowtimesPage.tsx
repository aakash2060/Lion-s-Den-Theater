import { useState, useEffect,} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieService } from "../services/api";
import { useTheater } from "../context/TheaterContext"; // Import the hook

const dummyShowtimes = [
  { time: "02:30 PM", screen: "Screen 1", seatsAvailable: 42 },
  { time: "05:00 PM", screen: "Screen 1", seatsAvailable: 35 },
  { time: "07:30 PM", screen: "Screen 2", seatsAvailable: 28 },
  { time: "10:00 PM", screen: "Screen 3", seatsAvailable: 18 },
];

const ShowtimesPage = () => {
  const { movieId } = useParams<{ movieId: string }>(); // Get movieId from URL
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null); // State for the movie data
  const [showtimes] = useState<any[]>(dummyShowtimes); // State for showtimes
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState<string | null>(null); // Error state for failed movie fetch

  // Use the context
  const { theater, loadingTheater } = useTheater();  // Now `theater` and `loadingTheater` have the correct types

  useEffect(() => {
    console.log("Movie ID from URL:", movieId);

    if (!movieId) {
      setError("Movie ID is missing.");
      setLoading(false);
      return;
    }

    const fetchMovieData = async () => {
      try {
        const movieData = await movieService.getById(Number(movieId));
        setMovie(movieData);
      } catch (err) {
        setError("Failed to load movie data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (loading || loadingTheater) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white p-6 min-h-screen">
      <h1 className="text-5xl font-extrabold text-center mb-8">
        Showtimes for {movie?.title || "Movie Not Found"}
      </h1>
      <p className="text-center text-xl mb-6">
        Theater: {theater?.name || "Select a Theater"}
      </p>

      <div className="space-y-4">
        {showtimes.map((showtime, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg">
            <div>
              <div className="text-xl">{showtime.time}</div>
              <div className="text-sm text-gray-400">Screen: {showtime.screen}</div>
            </div>
            <button
              onClick={() => navigate(`/seats/${movieId}`)} // Navigate to the seat selection page
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
            >
              🎟️ {showtime.seatsAvailable} Seats
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowtimesPage;
