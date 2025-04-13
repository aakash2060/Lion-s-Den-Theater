import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieService } from "../services/api";
import { showtimeService } from "../services/ShowtimeApi";
import { ticketService } from '../services/TicketApi'; 
import { useTheater } from "../context/TheaterContext";
import { useAuth } from "../context/AuthContext";
import { Showtime, ShowtimeDetail } from "../Data/ShowtimeInterfaces";
import { motion } from "framer-motion";

const ShowtimesPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { theater } = useTheater();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<any>(null);
  const [allShowtimes, setAllShowtimes] = useState<Showtime[]>([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeDetail | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  // Date navigation state
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!movieId || !theater?.id) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const movieData = await movieService.getById(Number(movieId));
        const showtimeData = await showtimeService.getByMovieId(Number(movieId));
        
        // Filter by theater
        const theaterShowtimes = showtimeData.filter((s) => s.theaterId === theater.id);
        
        // Filter out past showtimes
        const now = new Date();
        const futureShowtimes = theaterShowtimes.filter((s) => new Date(s.startTime) > now);
        
        // Extract available dates
        const dates = futureShowtimes.map(s => {
          const date = new Date(s.startTime);
          return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        });
        
        // Remove duplicates
        const uniqueDates = Array.from(new Set(dates.map(d => d.toDateString())))
          .map(dateStr => new Date(dateStr))
          .sort((a, b) => a.getTime() - b.getTime());
        
        setMovie(movieData);
        setAllShowtimes(futureShowtimes);
        setAvailableDates(uniqueDates);
        
        // Set initial date to today or the first available date
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

  // Filter showtimes when selected date changes
  useEffect(() => {
    if (!allShowtimes.length) return;
    
    const filtered = allShowtimes.filter(showtime => {
      const showtimeDate = new Date(showtime.startTime);
      return showtimeDate.toDateString() === selectedDate.toDateString();
    });
    
    setFilteredShowtimes(filtered);
    // Reset selected showtime when date changes
    setSelectedShowtime(null);
    setSelectedSeats([]);
  }, [selectedDate, allShowtimes]);

  const fetchShowtimeDetails = async (id: number) => {
    try {
      setIsLoading(true);
      // Fetch showtime details
      const detail = await showtimeService.getById(id);
      setSelectedShowtime(detail);
      
      // Fetch booked seats for this showtime
      const ticketsResponse = await ticketService.getByShowtime(id);
      const bookedSeatNumbers = ticketsResponse.map((ticket: any) => ticket.seatNumber);
      setBookedSeats(bookedSeatNumbers);
      
      // Reset selections
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
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  // Other methods like generateSeatsFromCapacity, handleSeatToggle, etc. remain the same

  // Your existing code for seat generation, booking, etc.
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
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBookingConfirm = async () => {
    if (selectedSeats.length === 0 || !selectedShowtime) {
      return;
    }

    // If not authenticated, prompt for email
    if (!isAuthenticated) {
      setShowEmailInput(true);
      return;
    }

    await processBooking();
  };

  const processBooking = async () => {
    if (selectedSeats.length === 0 || !selectedShowtime) {
      return;
    }

    try {
      setBookingInProgress(true);
      setError(null);

      // Create booking requests for each selected seat
      const bookingPromises = selectedSeats.map(seatNumber => {
        return ticketService.purchaseTicket({
          showtimeId: selectedShowtime.id,
          seatNumber: seatNumber,
          ticketType: 'Standard',
          email: email || undefined // Only include if email was provided
        });
      });

      // Process all booking requests
      const responses = await Promise.all(bookingPromises);
      const tickets = responses.map(response => response);
      
      // Navigate to confirmation or show confirmation dialog
      navigate('/confirmation', {
        state: {
          tickets,
          showtime: selectedShowtime,
          selectedSeats,
          totalPrice: selectedSeats.length * selectedShowtime.price
        }
      });
    } catch (err: any) {
      console.error("Booking error:", err);
      const errorMessage = err.response?.data || "Failed to complete booking. Please try again.";
      setError(errorMessage);
    } finally {
      setBookingInProgress(false);
      setShowEmailInput(false);
    }
  };

  const renderSeatGrid = () => {
    // Your existing seat grid code
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
              const isBooked = bookedSeats.includes(seat);
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
      <p className="text-center text-gray-400 mb-4">Theater: {theater?.name}</p>

      {/* Date selection */}
      {availableDates.length > 0 && (
        <div className="flex justify-center items-center mb-8 overflow-x-auto py-2">
          <div className="flex gap-2">
            {availableDates.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 rounded-md whitespace-nowrap ${
                  date.toDateString() === selectedDate.toDateString()
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && !selectedShowtime ? (
        <div className="flex justify-center items-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : filteredShowtimes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">No showtimes available for this date.</p>
          {availableDates.length > 0 && (
            <p className="mt-2 text-gray-500">Please select another date.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShowtimes.map((showtime) => {
            const start = new Date(showtime.startTime);
            // Sort showtimes by start time
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
      )}

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

          {isLoading ? (
            <div className="flex justify-center items-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : (
            renderSeatGrid()
          )}

          {error && (
            <div className="bg-red-900 text-white p-3 rounded-md max-w-md mx-auto mt-6">
              {error}
            </div>
          )}

          {showEmailInput ? (
            <div className="max-w-md mx-auto mt-6 bg-gray-800 p-4 rounded-lg">
              <label htmlFor="email" className="block mb-2">Enter your email for ticket confirmation:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="Email address"
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  className="bg-gray-600 px-4 py-2 rounded-md"
                  onClick={() => setShowEmailInput(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold"
                  onClick={processBooking}
                  disabled={!email || bookingInProgress}
                >
                  {bookingInProgress ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center mt-8">
              <div className="mb-3">
                <p>Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</p>
                <p>Total: ${(selectedSeats.length * selectedShowtime.price).toFixed(2)}</p>
              </div>
              <button
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md font-semibold disabled:opacity-50"
                onClick={handleBookingConfirm}
                disabled={selectedSeats.length === 0 || bookingInProgress}
              >
                {bookingInProgress ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowtimesPage;