import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

// Import movie data
import movies from "../constants/movies.json";

const MovieCarousel = () => {
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
        {movies.map((movie, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full group">
              {/* Background Image with Smooth Zoom Effect */}
              <img
                src={movie.background || movie.image}
                alt={movie.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-10 flex flex-col justify-end">
                {/* Fade-in Animation for Text */}
                <h2 className="text-white text-5xl font-bold drop-shadow-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-700">
                  {movie.name}
                </h2>

                {/* Release Date & Rating */}
                <p className="text-gray-300 mt-2 text-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-700 delay-100">
                  📅 {movie.release_date} • ⭐ {movie.rating || "N/A"}
                </p>

                {/* Description with Delay Effect */}
                <p className="text-gray-400 mt-2 text-lg max-w-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-700 delay-200">
                  {movie.description}
                </p>

                {/* Buttons - Fade-in with Delay */}
                <div className="mt-4 flex space-x-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-700 delay-300">
                  <a href={movie.trailer} target="_blank" rel="noopener noreferrer">
                    <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition">
                      🎥 Watch Trailer
                    </button>
                  </a>
                  <button className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded-lg transition">
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
