import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { movieService } from "../services/api";
import { showtimeService } from "../services/ShowtimeApi";
import { useTheater } from "../context/TheaterContext";
import { Showtime } from "../Data/ShowtimeInterfaces";

const ShowtimesPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { theater } = useTheater();

  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const bookedSeats = [7, 13, 22, 36]; // frontend only

  useEffect(() => {
    if (!movieId || !theater?.id) return;

    const fetchData = async () => {
      try {
        const movieData = await movieService.getById(Number(movieId));
        const showtimeData = await showtimeService.getByMovieId(Number(movieId));
        const filtered = showtimeData.filter(s => s.theaterId === theater.id);

        setMovie(movieData);
        setShowtimes(filtered);
      } catch (err) {
        console.error("Failed to load showtimes", err);
      }
    };

    fetchData();
  }, [movieId, theater]);

  const handleSeatToggle = (seat: number) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const renderSeatGrid = () => {
    const seats = Array.from({ length: 50 }, (_, i) => i + 1);
    return (
      <div className="grid grid-cols-10 gap-2 justify-center mt-6">
        {seats.map((seat) => (
          <div
            key={seat}
            onClick={() => handleSeatToggle(seat)}
            className={`text-sm w-10 h-10 flex items-center justify-center rounded-md cursor-pointer transition
              ${bookedSeats.includes(seat)
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : selectedSeats.includes(seat)
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-white hover:bg-red-500"}`}
          >
            {seat}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-4">Showtimes for {movie?.title}</h1>
      <p className="text-center text-gray-400 mb-8">Theater: {theater?.name}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showtimes.map((showtime) => {
          const start = new Date(showtime.startTime);
          return (
            <div
              key={showtime.id}
              onClick={() => {
                setSelectedShowtime(showtime);
                setSelectedSeats([]);
                setTimeout(() => {
                  document.getElementById("seatSection")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className={`p-4 rounded-lg cursor-pointer border transition shadow-lg
                ${selectedShowtime?.id === showtime.id ? "border-red-500 bg-gray-800" : "border-gray-700 bg-gray-900"}`}
            >
              <div className="text-xl font-semibold">
                {start.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
              <p className="text-sm text-gray-400">Hall: {showtime.hallNumber}</p>
              <p className="text-sm text-gray-400">Format: {showtime.is3D ? "3D" : "2D"}</p>
              <p className="text-red-500 font-bold mt-2">🎟️ ${showtime.price.toFixed(2)}</p>
            </div>
          );
        })}
      </div>

      {selectedShowtime && (
        <div id="seatSection" className="mt-10">
          <h2 className="text-2xl font-bold text-center">Select Your Seats</h2>
          <p className="text-center text-gray-400 mt-1">
            Showtime: {new Date(selectedShowtime.startTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>

          {renderSeatGrid()}

          <div className="text-center mt-6">
            <button
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md font-semibold"
              onClick={() => alert(`You booked ${selectedSeats.length} seat(s): ${selectedSeats.join(", ")}`)}
              disabled={selectedSeats.length === 0}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowtimesPage;