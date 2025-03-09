import React from "react";
import MovieCard from "../Components/movieCard";

const DiscoverMovies = () => {
  return (
    <div>
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Discover Movies</h1>
      <p className="mt-4 text-lg text-gray-600">Find the best movies curated for you!</p>

      <div className="flex flex-wrap justify-center gap-6 mt-6">
        <MovieCard
          name="Mickey 17"
          release_date="March 7, 2025"
          duration="2 HR 17 MIN"
          image="https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg"
        />
        <MovieCard
          name="Captain America: Brave New World"
          release_date="February 14, 2025"
          duration="1 HR 58 MIN"
          image="https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg"
        />
      </div>
    </div>
    </div>
  );
};

export default DiscoverMovies;
