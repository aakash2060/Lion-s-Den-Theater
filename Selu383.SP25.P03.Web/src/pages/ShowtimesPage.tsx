import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { movieService } from "../services/MovieApi";
import { MovieDetails } from "../Data/MovieInterfaces";

const ShowtimesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);

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
        
        // Set initial selected theater if available
        if (movieData.showtimes && movieData.showtimes.length > 0) {
          const theaters = new Set(movieData.showtimes.map((s: { theaterName: any; }) => s.theaterName));
          if (theaters.size > 0) {
            setSelectedTheater(movieData.showtimes[0].theaterName);
          }
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id]);

  // Generate the next 7 days for date selection
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Filter showtimes based on selected date and theater
  const getFilteredShowtimes = () => {
    if (!movie || !movie.showtimes) return [];
    
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

  // Get all unique theaters from showtimes
  const getUniqueTheaters = () => {
    if (!movie || !movie.showtimes) return [];
    
    const theaters = new Set(movie.showtimes.map(s => s.theaterName));
    return Array.from(theaters);
  };

  const filteredShowtimes = getFilteredShowtimes();
  const uniqueTheaters = getUniqueTheaters();

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

      {/* Date Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Select Date</h2>
        <div className="flex overflow-x-auto pb-4 gap-2">
          {nextSevenDays.map((date, index) => {
            const isSelected = 
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