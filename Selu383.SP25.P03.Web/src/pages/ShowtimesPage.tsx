import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieService } from "../services/api";
import { showtimeService } from "../services/ShowtimeApi";
import { ticketService } from '../services/TicketApi'; 
import { useTheater } from "../context/TheaterContext";
import { Showtime, ShowtimeDetail } from "../Data/ShowtimeInterfaces";
import { motion } from "framer-motion";

const ShowtimesPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { theater } = useTheater();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<any>(null);
  const [allShowtimes, setAllShowtimes] = useState<Showtime[]>([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeDetail | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!movieId || !theater?.id) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const movieData = await movieService.getById(Number(movieId));
        const showtimeData = await showtimeService.getByMovieId(Number(movieId));

        const theaterShowtimes = showtimeData.filter((s) => s.theaterId === theater.id);

        const now = new Date();
        const futureShowtimes = theaterShowtimes.filter((s) => new Date(s.startTime) > now);

        const dates = futureShowtimes.map(s => {
          const date = new Date(s.startTime);
          return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        });

        const uniqueDates = Array.from(new Set(dates.map(d => d.toDateString())))
          .map(dateStr => new Date(dateStr))
          .sort((a, b) => a.getTime() - b.getTime());

        setMovie(movieData);
        setAllShowtimes(futureShowtimes);
        setAvailableDates(uniqueDates);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayAvailable = uniqueDates.some(d => d.toDateString() === today.toDateString());
        if (todayAvailable) {
          setSelectedDate(today);
        } else if (uniqueDates.length > 0) {
          setSelectedDate(uniqueDates[0]);
        }
      } catch (err) {
        console.error("Failed to load showtimes", err);
        setError("Failed to load showtimes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [movieId, theater]);

  useEffect(() => {
    if (!allShowtimes.length) return;

    const filtered = allShowtimes.filter(showtime => {
      const showtimeDate = new Date(showtime.startTime);
      return showtimeDate.toDateString() === selectedDate.toDateString();
    });

    setFilteredShowtimes(filtered);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  }, [selectedDate, allShowtimes]);

  const fetchShowtimeDetails = async (id: number) => {
    try {
      setIsLoading(true);
      const detail = await showtimeService.getById(id);
      setSelectedShowtime(detail);

      const ticketsResponse = await ticketService.getByShowtime(id);
      const bookedSeatNumbers = ticketsResponse.map((ticket: any) => ticket.seatNumber);
      setBookedSeats(bookedSeatNumbers);

      setSelectedSeats([]);
      setError(null);

      setTimeout(() => {
        document.getElementById("seatSection")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Failed to load showtime detail", err);
      setError("Failed to load seat information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const generateSeatsFromCapacity = (capacity: number): string[] => {
    const seatsPerRow = 10;
    const totalRows = Math.ceil(capacity / seatsPerRow);
    const seats: string[] = [];

    for (let row = 0; row < totalRows; row++) {
      const rowLetter = String.fromCharCode(65 + row);
      for (let num = 1; num <= seatsPerRow; num++) {
        const seatNumber = row * seatsPerRow + num;
        if (seatNumber > capacity) break;
        seats.push(`${rowLetter}${num}`);
      }
    }

    return seats;
  };

  const handleSeatToggle = (seat: string) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBookingConfirm = () => {
    if (selectedSeats.length === 0 || !selectedShowtime) return;
    navigate('/orders', {
      state: {
        selectedSeats,
        showtime: selectedShowtime,
        totalPrice: selectedSeats.length * selectedShowtime.price
      }
    });
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
      <div className="flex flex-col items-center gap-6 mt-10">
        <div className="text-center text-gray-400 text-sm mb-4">📽 Screen This Way</div>
        {Object.entries(groupedByRow).map(([rowLetter, rowSeats], rowIndex) => {
          const left = rowSeats.slice(0, 3);
          const middle = rowSeats.slice(3, 7);
          const right = rowSeats.slice(7, 10);
          return (
            <motion.div
              key={rowLetter}
              className="flex items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
            >
              <span className="w-6 font-semibold text-gray-400 text-sm">{rowLetter}</span>
              <div className="flex gap-6">
                {[left, middle, right].map((block, idx) => (
                  <div key={idx} className="flex gap-2">
                    {block.map((seat) => {
                      const isBooked = bookedSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);
                      const isPremium = seat.charAt(0) <= "C";
                      return (
                        <motion.div
                          whileHover={!isBooked ? { scale: 1.1 } : {}}
                          whileTap={!isBooked ? { scale: 0.95 } : {}}
                          key={seat}
                          onClick={() => handleSeatToggle(seat)}
                          className={`w-10 h-10 rounded-md text-sm font-semibold flex items-center justify-center cursor-pointer transition-all
                            ${
                              isBooked
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : isSelected
                                ? "bg-yellow-400 text-black"
                                : isPremium
                                ? "bg-purple-600 text-white hover:bg-yellow-500"
                                : "bg-blue-600 text-white hover:bg-yellow-500"
                            }`}
                          title={isPremium ? "Premium Seat" : "Standard Seat"}
                        >
                          {seat}
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
        <div className="flex flex-wrap gap-6 justify-center mt-10 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-sm"></div> Standard
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded-sm"></div> Premium
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
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">{movie?.title ?? "Loading Movie..."}</h1>
      {availableDates.length > 0 && (
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {availableDates.map((date) => (
            <button
              key={date.toDateString()}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-2 rounded-md ${
                date.toDateString() === selectedDate.toDateString()
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      )}
      {isLoading && <p className="text-center">Loading showtimes...</p>}
      {!isLoading && filteredShowtimes.length === 0 && (
        <p className="text-center text-gray-400">No showtimes available.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShowtimes.map((showtime) => (
          <div
            key={showtime.id}
            className="p-4 border border-gray-700 rounded-md hover:border-red-500 cursor-pointer"
            onClick={() => fetchShowtimeDetails(showtime.id)}
          >
            <h2 className="text-lg font-bold">
              {new Date(showtime.startTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h2>
            <p className="text-gray-400">Hall: {showtime.hallNumber}</p>
          </div>
        ))}
      </div>

      {selectedShowtime && (
        <div className="mt-10" id="seatSection">
          <h2 className="text-2xl font-bold text-center mb-4">Select Your Seats</h2>
          {renderSeatGrid()}
          <div className="text-center mt-6">
            <p>Selected: {selectedSeats.join(", ") || "None"}</p>
            <button
              onClick={handleBookingConfirm}
              className="mt-4 px-6 py-2 bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              disabled={selectedSeats.length === 0}
            >
              Continue to Order Summary
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900 text-white p-4 mt-6 rounded-md text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default ShowtimesPage;