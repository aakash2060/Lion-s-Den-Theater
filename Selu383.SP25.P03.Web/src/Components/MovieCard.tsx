import React from "react";
import { Link } from "react-router-dom";

interface MovieProps {
  name: string;
  duration: string;
  release_date: string;
  image: string;
  rating?: string;
  category?: string;
  director?: string;
  cast?: string[];
  rottenTomatoes?: string;
  streamingOn?: string[];
  trailer?: string;
}

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
  name,
  duration,
  release_date,
  image,
  rating,
  category,
  director,
  cast,
  rottenTomatoes,
  trailer,
}) => {
  const borderClass = category ? genreColors[category] || genreColors["Default"] : genreColors["Default"];
  const movieUrl = `/movie-description/${encodeURIComponent(name)}`;

  return (
    <Link to={movieUrl}>
      <div
        className={`relative w-64 bg-gray-900 shadow-lg border ${borderClass} rounded-lg overflow-hidden transition-transform duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer`}
      >
        {/* Movie Image */}
        <img
          className="w-full h-80 object-cover transition-opacity duration-500 group-hover:opacity-80"
          src={image}
          alt={name}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-0 group-hover:opacity-100 transition duration-500"></div>

        {/* Movie Details on Hover */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <h5 className="text-xl font-bold text-white mb-1">{name}</h5>
          <p className="text-sm text-gray-300">⏳ {duration} | 📅 {release_date}</p>
          <p className="text-sm text-yellow-400">⭐ {rating || "N/A"} | 🍅 {rottenTomatoes || "N/A"}%</p>
          <p className="text-sm text-gray-400 mt-1">🎬 {director || "Director Unknown"}</p>
          <p className="text-sm text-gray-400">🎭 {cast ? cast.join(", ") : "Cast Unknown"}</p>

          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-primary hover:bg-red-600 text-white font-semibold py-2 rounded-md transition duration-300">
              👀 View Details
            </button>
            {trailer && (
              <a
                href={trailer}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-2 rounded-md transition duration-300"
              >
                ▶ Trailer
              </a>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;