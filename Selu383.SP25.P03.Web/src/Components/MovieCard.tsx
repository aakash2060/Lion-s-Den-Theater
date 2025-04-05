import React from "react";
import { Link } from "react-router-dom";
import { MovieProps } from "../Data/MovieInterfaces";

const genreColors: { [key: string]: string } = {
  Action: "border-red-600 shadow-red-500",
  "Sci-Fi": "border-blue-500 shadow-blue-400",
  Drama: "border-yellow-400 shadow-yellow-300",
  Comedy: "border-green-400 shadow-green-300",
  Horror: "border-purple-600 shadow-purple-500",
  Animation: "border-orange-400 shadow-orange-300",
  Fantasy: "border-pink-500 shadow-pink-400",
  Crime: "border-indigo-500 shadow-indigo-400",
  Biography: "border-teal-500 shadow-teal-400",
  Default: "border-gray-700 shadow-gray-500",
};

const MovieCard: React.FC<MovieProps> = ({
  id,
  title,
  posterUrl,
  releaseDate,
  genre,
  rating,
}) => {
  const borderClass = genre ? genreColors[genre] || genreColors["Default"] : genreColors["Default"];
  const movieUrl = `/movie/${id}`;
  const formattedDate = new Date(releaseDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link to={movieUrl}>
      <div
        className={`relative w-full h-full flex flex-col bg-gray-900 shadow-lg border ${borderClass} rounded-lg overflow-hidden transition-transform duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer`}
      >
        {/* Movie Poster */}
        <img
          className="w-full aspect-[2/3] object-cover transition-opacity duration-500 group-hover:opacity-80"
          src={posterUrl}
          alt={title}
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder-poster.jpg";
          }}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition duration-300" />

        {/* Movie Info */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <h5 className="text-xl font-bold text-white mb-1">{title}</h5>
          <p className="text-sm text-gray-300">📅 {formattedDate}</p>
          <p className="text-sm text-yellow-400">⭐ {rating || "N/A"}</p>
          <p className="text-sm text-gray-400 mt-1">{genre}</p>

          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition duration-300">
              👀 View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
