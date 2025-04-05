import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieService } from "../services/api";
import { showtimeService } from "../services/ShowtimeApi";
import { useTheater } from "../context/TheaterContext";
import { Showtime } from "../Data/ShowtimeInterfaces";

const ShowtimesPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { theater, loadingTheater } = useTheater();

  useEffect(() => {
    if (!movieId || !theater?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const movieData = await movieService.getById(Number(movieId));
        const showtimeData = await showtimeService.getByMovieId(Number(movieId));
        const filtered = showtimeData.filter(s => s.theaterId === theater.id);

        setMovie(movieData);
        setShowtimes(filtered);
      } catch (err) {
        console.error(err);
        setError("Failed to load movie/showtime data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId, theater]);

  if (loading || loadingTheater) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading showtimes...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-xl text-red-500">{error || "Movie not found."}</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white p-6 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-4">
        Showtimes for {movie.title}
      </h1>
      <p className="text-center text-lg text-gray-300 mb-8">
        Theater: <span className="font-semibold">{theater?.name}</span>
      </p>

      {showtimes.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-lg">No showtimes available at this theater.</p>
          <p className="text-sm text-gray-400 mt-2">
            Try selecting a different theater or movie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showtimes.map((showtime) => {
            const startTime = new Date(showtime.startTime);
            return (
              <div
                key={showtime.id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center"
              >
                <div>
                  <div className="text-xl font-semibold">
                    {startTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                  <div className="text-sm text-gray-400">
                    Hall: {showtime.hallNumber}
                  </div>
                  <div className="text-sm text-gray-400">
                    Format: {showtime.is3D ? "3D" : "2D"}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/seats/${movieId}/${showtime.id}`)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
                >
                  🎟️ ${showtime.price?.toFixed(2) || "0.00"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-md"
        >
          ← Back to Movies
        </button>
      </div>
    </div>
  );
};

export default ShowtimesPage;