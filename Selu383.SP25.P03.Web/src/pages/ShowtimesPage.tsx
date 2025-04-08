import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { movieService } from "../services/api";
import { showtimeService } from "../services/ShowtimeApi";
import { useTheater } from "../context/TheaterContext";
import { Showtime, ShowtimeDetail } from "../Data/ShowtimeInterfaces";
import { motion } from "framer-motion";

const ShowtimesPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { theater } = useTheater();

  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeDetail | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const bookedSeatLabels = ["A3", "B4", "C5", "D2"]; // Mock booked

  useEffect(() => {
    if (!movieId || !theater?.id) return;

    const fetchData = async () => {
      try {
        const movieData = await movieService.getById(Number(movieId));
        const showtimeData = await showtimeService.getByMovieId(Number(movieId));
        const filtered = showtimeData.filter((s) => s.theaterId === theater.id);
        setMovie(movieData);
        setShowtimes(filtered);
      } catch (err) {
        console.error("Failed to load showtimes", err);
      }
    };

    fetchData();
  }, [movieId, theater]);

  const fetchShowtimeDetails = async (id: number) => {
    try {
      const detail = await showtimeService.getById(id); // ✅ updated here
      setSelectedShowtime(detail);
      setSelectedSeats([]);
      setTimeout(() => {
        document.getElementById("seatSection")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Failed to load showtime detail", err);
    }
  };

  const generateSeatsFromCapacity = (capacity: number): string[] => {
    const seatsPerRow = 10;
    const totalRows = Math.ceil(capacity / seatsPerRow);
    const seats: string[] = [];

    for (let row = 0; row < totalRows; row++) {
      const rowLetter = String.fromCharCode(65 + row); // A, B, C...
      for (let num = 1; num <= seatsPerRow; num++) {
        const seatNumber = row * seatsPerRow + num;
        if (seatNumber > capacity) break;
        seats.push(`${rowLetter}${num}`);
      }
    }

    return seats;
  };

  const handleSeatToggle = (seat: string) => {
    if (bookedSeatLabels.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const renderSeatGrid = () => {
    if (!selectedShowtime?.totalSeats) return null;

    const capacity = selectedShowtime.totalSeats;
    const seats = generateSeatsFromCapacity(capacity);
    const groupedByRow: Record<string, string[]> = {};

    seats.forEach((seat) => {
      const row = seat.charAt(0);
      if (!groupedByRow[row]) groupedByRow[row] = [];
      groupedByRow[row].push(seat);
    });

    return (
      <div className="flex flex-col items-center gap-4 mt-8">
        <div className="text-center text-gray-300 mb-4 text-sm">📽 Screen This Way</div>

        {Object.entries(groupedByRow).map(([rowLetter, rowSeats]) => (
          <div key={rowLetter} className="flex gap-2 items-center">
            <span className="w-4 text-gray-400">{rowLetter}</span>
            {rowSeats.map((seat) => {
              const isBooked = bookedSeatLabels.includes(seat);
              const isSelected = selectedSeats.includes(seat);

              return (
                <motion.div
                  whileHover={!isBooked ? { scale: 1.1 } : {}}
                  whileTap={!isBooked ? { scale: 0.95 } : {}}
                  key={seat}
                  onClick={() => handleSeatToggle(seat)}
                  className={`w-10 h-10 rounded-md text-sm font-bold flex items-center justify-center cursor-pointer transition-all
                    ${
                      isBooked
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : isSelected
                        ? "bg-yellow-400 text-black"
                        : "bg-blue-600 text-white hover:bg-yellow-500"
                    }`}
                >
                  {seat}
                </motion.div>
              );
            })}
          </div>
        ))}

        <div className="flex gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-sm"></div> Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div> Selected
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded-sm"></div> Booked
          </div>
        </div>
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
              onClick={() => fetchShowtimeDetails(showtime.id)}
              className={`p-4 rounded-lg cursor-pointer border transition shadow-lg
                ${
                  selectedShowtime?.id === showtime.id
                    ? "border-red-500 bg-gray-800"
                    : "border-gray-700 bg-gray-900"
                }`}
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
            Showtime:{" "}
            {new Date(selectedShowtime.startTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>

          {renderSeatGrid()}

          <div className="text-center mt-8">
            <button
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md font-semibold"
              onClick={() =>
                alert(`🎟️ You booked ${selectedSeats.length} seat(s): ${selectedSeats.join(", ")}`)
              }
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
