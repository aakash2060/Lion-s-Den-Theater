import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { useState, useEffect } from "react";
import { movieService } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Movie } from "../Data/MovieInterfaces";
import { useTheater } from "../context/TheaterContext";

interface MovieCarouselProps {
  movies?: Movie[];
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies: propMovies }) => {
  const navigate = useNavigate();
  const { theater } = useTheater();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propMovies && propMovies.length > 0) {
      setMovies(propMovies);
      setLoading(false);
      return;
    }

    const fetchMovies = async () => {
      try {
        const data = await movieService.getAll();
        const sortedMovies = [...data]
          .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
          .slice(0, 5);
        setMovies(sortedMovies);
      } catch (error) {
        console.error("Failed to fetch movies for carousel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [propMovies]);

  if (loading || movies.length === 0) {
    return (
      <div className="w-full h-[600px] bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px]">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        className="w-full h-full"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="relative w-full h-full group">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder-background.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-10 flex flex-col justify-end">
                <h2 className="text-white text-5xl font-bold drop-shadow-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-700">
                  {movie.title}
                </h2>
                <p className="text-gray-300 mt-2 text-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-700 delay-100">
                  📅 {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })} • ⭐ {movie.rating || "N/A"}
                </p>
                <p className="text-gray-400 mt-2 text-lg max-w-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-700 delay-200">
                  {movie.description}
                </p>
                <div className="mt-4 flex space-x-4 transition duration-700 delay-300">

                  <button 
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    🎥 View Details
                  </button>
                  <button 
                    className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                    onClick={() => {
                      if (!theater) {
                        alert("Please select a theater to book showtimes.");
                        return;
                      }
                      navigate(`/showtimes/${movie.id}`);
                    }}
                  >
                    🎟️ Book Now
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;