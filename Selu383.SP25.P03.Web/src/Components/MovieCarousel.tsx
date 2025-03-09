import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

// Correct CSS imports
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


// Import movie data
import movies from "../constants/movies.json";

const MovieCarousel = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        className="mySwiper"
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={index}>
            <img
              src={movie.image}
              alt={movie.name}
              className="w-full h-[400px] object-cover rounded-lg"
            />
            <div className="text-center mt-2">
              <h2 className="text-xl font-bold">{movie.name}</h2>
              <p className="text-gray-300">{movie.release_date}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
