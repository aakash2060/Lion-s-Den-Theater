import React, { useState } from "react";
import MovieCard from "../Components/MovieCard";
import movies from "../constants/movies.json";
import QRCard from "../Components/QRCard";

const DiscoverMovies = () => {
  const [filter, setFilter] = useState("All");
  const [sortOption, setSortOption] = useState("rating"); // Default sorting
  const [hoveredMovie, setHoveredMovie] = useState<string | null>(null);

  // Filtering Movies (By Genre & Status)
  const filteredMovies =
    filter === "All"
      ? movies
      : movies.filter(
          (movie) => movie.category === filter || movie.status === filter
        );

  // Sorting Movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortOption === "rating") {
      return parseFloat(b.rating) - parseFloat(a.rating); // Highest rated first
    }
    if (sortOption === "duration") {
      return (
        parseInt(b.duration.replace(/\D/g, "")) -
        parseInt(a.duration.replace(/\D/g, ""))
      ); // Longest movie first
    }
    if (sortOption === "alphabetical") {
      return a.name.localeCompare(b.name); // A → Z sorting
    }
    return 0;
  });

  return (
    <div className="px-8 py-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">🎬 Discover Movies</h1>
        <p className="mt-2 text-lg text-gray-400">
          Find the best movies curated for you!
        </p>
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-wrap justify-between mt-6 gap-4">
        {/* Genre Filters */}
        <select
          className="p-2 bg-gray-800 text-white rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Movies</option>
          <option value="now_showing">Now Showing</option>
          <option value="upcoming">Upcoming</option>
          <option value="Action">Action</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Drama">Drama</option>
          <option value="Animation">Animation</option>
        </select>

        {/* Sorting Options */}
        <select
          className="p-2 bg-gray-800 text-white rounded"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="rating">Highest Rated</option>
          <option value="duration">Longest Duration</option>
          <option value="alphabetical">Alphabetical (A → Z)</option>
        </select>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-5 gap-6 mt-6">
        {sortedMovies.map((movie, i) => (
          <div
            key={i}
            className="relative"
            onMouseEnter={() => setHoveredMovie(movie.name)}
            onMouseLeave={() => setHoveredMovie(null)}
          >
            <MovieCard {...movie} />
            {hoveredMovie === movie.name }
          </div>
        ))}
      </div>

      {/* Featured Section */}
      <div className="mt-12 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl font-bold">🍿 Making Your Moments Special</h2>
          <p className="text-gray-400 mt-2">
            Lion's Den is the place we go for magic, where stories feel perfect
            and powerful. Academy Award® winner Nicole Kidman reveals why movies
            are better here than anywhere else.
          </p>
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0">
          <iframe
            className="w-full max-w-2xl h-64 md:h-96"
            src="https://www.youtube.com/embed/Way9Dexny3w"
            title="youtube-trailer-openhiemer"
            allow="autoplay; picture-in-picture;"
            allowFullScreen
          />
        </div>
      </div>

      {/* QR Code for App Download */}
      <div className="flex justify-center mt-10 mb-10">
        <QRCard />
      </div>
    </div>
  );
};

export default DiscoverMovies;
