import React from "react";
import MovieCarousel from "../Components/MovieCarousel";

const Home = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Welcome to Lion’s Den!</h1>
      <p className="mt-4 text-lg text-gray-600">Discover amazing movies and delicious food.</p>
      <MovieCarousel />
    </div>
  );
};

export default Home;
