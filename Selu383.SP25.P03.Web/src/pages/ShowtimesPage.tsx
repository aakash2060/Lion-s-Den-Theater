import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { movieService } from "../services/MovieApi";
import { showtimeService } from "../services/ShowtimeApi";
import { MovieDetails } from "../Data/MovieInterfaces";
import { Showtime } from "../Data/ShowtimeInterfaces";

// Interface for movie with showtimes
interface MovieWithShowtimes extends MovieDetails {
  showtimes?: Showtime[];
}

const ShowtimesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieWithShowtimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Get movie details
        const movieData = await movieService.getById(parseInt(id, 10));
        console.log("Movie data:", movieData);
        
        // Get showtimes for this movie
        const showtimesData = await showtimeService.getByMovieId(parseInt(id, 10));
        console.log("Showtimes data:", showtimesData);
        
        // Combine the data
        const movieWithShowtimes: MovieWithShowtimes = {
          ...movieData,
          showtimes: showtimesData
        };
        
        setMovie(movieWithShowtimes);
        
        // Extract unique dates
        const dates = getUniqueDates(showtimesData);
        setAvailableDates(dates);
        
        // Find first date that has showtimes
        if (dates.length > 0) {
          // Find the first date with showtimes
          const dateWithShowtimes = dates.find(date => {
            return showtimesData.some(showtime => {
              const showtimeDate = new Date(showtime.startTime);
              return showtimeDate.getDate() === date.getDate() && 
                     showtimeDate.getMonth() === date.getMonth() && 
                     showtimeDate.getFullYear() === date.getFullYear();
            });
          });
          
          // Set to first date with showtimes, or first date if none found
          setSelectedDate(dateWithShowtimes || dates[0]);
        }
        
        // Set initial selected theater if available
        if (showtimesData && showtimesData.length > 0) {
          const theaters = new Set(showtimesData.map(s => s.theaterName));
          if (theaters.size > 0) {
            setSelectedTheater(showtimesData[0].theaterName);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load movie details and showtimes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Extract unique dates from showtimes data
  const getUniqueDates = (showtimes: Showtime[] | undefined) => {
    if (!showtimes || showtimes.length === 0) return [];
    
    const uniqueDates = new Set(
      showtimes.map(showtime => {
        const date = new Date(showtime.startTime);
        return date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
      })
    );
    
    return Array.from(uniqueDates)
      .map(dateString => new Date(dateString))
      .sort((a, b) => a.getTime() - b.getTime()); // Sort chronologically
  };

  // Filter showtimes based on selected date and theater
  const getFilteredShowtimes = () => {
    if (!movie || !movie.showtimes || !selectedDate) return [];
    
    return movie.showtimes.filter(showtime => {
      const showtimeDate = new Date(showtime.startTime);
      const isSameDate = 
        showtimeDate.getDate() === selectedDate.getDate() && 
        showtimeDate.getMonth() === selectedDate.getMonth() && 
        showtimeDate.getFullYear() === selectedDate.getFullYear();
      
      const isSelectedTheater = !selectedTheater || showtime.theaterName === selectedTheater;
      
      return isSameDate && isSelectedTheater;
    });
  };
  
  // Check if a date has any showtimes for the selected theater
  const dateHasShowtimes = (date: Date) => {
    if (!movie || !movie.showtimes) return false;
    
    return movie.showtimes.some(showtime => {
      const showtimeDate = new Date(showtime.startTime);
      const isSameDate = 
        showtimeDate.getDate() === date.getDate() && 
        showtimeDate.getMonth() === date.getMonth() && 
        showtimeDate.getFullYear() === date.getFullYear();
      
      const matchesTheater = !selectedTheater || showtime.theaterName === selectedTheater;
      
      return isSameDate && matchesTheater;
    });
  };

  // Get all unique theaters from showtimes
  const getUniqueTheaters = () => {
    if (!movie || !movie.showtimes) return [];
    
    const theaters = new Set(movie.showtimes.map(s => s.theaterName));
    return Array.from(theaters);
  };

  const filteredShowtimes = getFilteredShowtimes();
  const uniqueTheaters = getUniqueTheaters();

  // For debugging
  console.log("Current movie state:", movie);
  console.log("Available dates:", availableDates);
  console.log("Selected date:", selectedDate);
  console.log("Filtered showtimes:", filteredShowtimes);
  console.log("Unique theaters:", uniqueTheaters);

  // No showtimes for this movie at all
  const noShowtimesAtAll = movie?.showtimes?.length === 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading showtimes...</div>
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

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen p-6">
      {/* Header with movie info */}
      <div className="flex items-center mb-8 p-4 bg-black bg-opacity-50 rounded-lg">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-16 h-24 object-cover rounded-md mr-4"
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder-poster.jpg"; // Fallback image
          }}
        />
        <div>
          <h1 className="text-2xl font-bold">{movie.title}</h1>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="text-sm px-2 py-0.5 bg-red-600 rounded-full">{movie.genre}</span>
            <span className="text-sm px-2 py-0.5 bg-gray-700 rounded-full">{movie.duration} min</span>
            <span className="text-sm px-2 py-0.5 bg-gray-700 rounded-full">
              {new Date(movie.releaseDate).getFullYear()}
            </span>
          </div>
        </div>
      </div>

      {noShowtimesAtAll ? (
        <div className="bg-gray-800 p-8 rounded-lg text-center my-12">
          <h2 className="text-2xl font-bold mb-4">No Showtimes Available</h2>
          <p className="text-lg mb-6">
            There are currently no showtimes scheduled for this movie.
          </p>
          <button 
            onClick={() => navigate("/")} 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md transition"
          >
            Browse Other Movies
          </button>
        </div>
      ) : (
        <>
          {/* Date Selection */}
          {availableDates.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Select Date</h2>
              <div className="flex overflow-x-auto pb-4 gap-2">
                {availableDates
                  .filter(date => dateHasShowtimes(date))
                  .map((date, index) => {
                    const isSelected = selectedDate && 
                      date.getDate() === selectedDate.getDate() && 
                      date.getMonth() === selectedDate.getMonth();
                    
                    return (
                      <div 
                        key={index}
                        className={`
                          flex-shrink-0 cursor-pointer p-3 rounded-lg min-w-20 text-center
                          ${isSelected ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
                        `}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="text-sm font-bold">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-lg font-bold">
                          {date.getDate()}
                        </div>
                        <div className="text-xs">
                          {date.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Theater Selection (if multiple theaters available) */}
          {uniqueTheaters.length > 1 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Select Theater</h2>
              <div className="flex flex-wrap gap-3">
                <div 
                  className={`cursor-pointer px-4 py-2 rounded-lg ${!selectedTheater ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                  onClick={() => setSelectedTheater(null)}
                >
                  All Theaters
                </div>
                {uniqueTheaters.map((theater, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer px-4 py-2 rounded-lg ${selectedTheater === theater ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                    onClick={() => setSelectedTheater(theater)}
                  >
                    {theater}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Showtimes Display */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Available Showtimes</h2>
            
            {filteredShowtimes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredShowtimes.map((showtime, index) => {
                  const showtimeDate = new Date(showtime.startTime);
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition duration-300"
                      onClick={() => navigate(`/booking/${id}/${showtime.id}`)}
                    >
                      <div className="text-lg font-bold">
                        {showtimeDate.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </div>
                      <div className="text-sm text-gray-300">{showtime.theaterName}</div>
                      <div className="text-sm text-gray-400">Hall {showtime.hallNumber}</div>
                      <div className="text-sm text-gray-400">{showtime.is3D ? '3D' : '2D'}</div>
                      <div className="mt-2 text-red-500 font-semibold">
                        ${showtime.price ? showtime.price.toFixed(2) : '0.00'}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <p className="text-lg">No showtimes available for this selection.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Try selecting a different date or theater.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button 
          onClick={() => navigate(`/movie/${id}`)} 
          className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition"
        >
          ← Back to Movie
        </button>
        
        <button 
          onClick={() => navigate("/")} 
          className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition"
        >
          Browse Other Movies
        </button>
      </div>
    </div>
  );
};

export default ShowtimesPage;