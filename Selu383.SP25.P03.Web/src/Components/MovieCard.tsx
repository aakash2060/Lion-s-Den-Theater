import React from "react";

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
}

const genreColors: { [key: string]: string } = {
  Action: "border-red-600 shadow-red-500",
  SciFi: "border-blue-500 shadow-blue-400",
  Drama: "border-yellow-400 shadow-yellow-300",
  Comedy: "border-green-400 shadow-green-300",
  Horror: "border-purple-600 shadow-purple-500",
  Animation: "border-orange-400 shadow-orange-300",
  Fantasy: "border-pink-500 shadow-pink-400",
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
  streamingOn,
}) => {
  const borderClass = category ? genreColors[category] || genreColors["Default"] : genreColors["Default"];

  return (
    <div className={`relative w-64 bg-gray-900 shadow-lg border ${borderClass} rounded-lg overflow-hidden transition-transform duration-500 hover:scale-105 hover:shadow-2xl group`}>
      {/* Movie Image */}
      <img className="w-full h-80 object-cover transition-opacity duration-500 group-hover:opacity-80" src={image} alt={name} />

      {/* Overlay Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-0 group-hover:opacity-100 transition duration-500"></div>

      {/* Movie Details (Appears on Hover with Sliding Animation) */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
        <h5 className="text-lg font-bold text-white translate-x-[-20px] group-hover:translate-x-0 transition-transform duration-500">
          {name}
        </h5>
        <p className="text-sm text-gray-300 translate-x-[-20px] group-hover:translate-x-0 transition-transform duration-500 delay-100">
          ⏳ {duration}
        </p>
        <p className="text-sm text-gray-300 translate-x-[-20px] group-hover:translate-x-0 transition-transform duration-500 delay-200">
          📅 {release_date}
        </p>
        <p className="text-sm text-yellow-400 translate-x-[-20px] group-hover:translate-x-0 transition-transform duration-500 delay-300">
          ⭐ {rating || "N/A"} | 🍅 {rottenTomatoes || "N/A"}%
        </p>

        {/* Extra Details (Director, Cast, Streaming) */}
        <p className="text-sm text-gray-400 mt-1 translate-x-[-20px] group-hover:translate-x-0 transition-transform duration-500 delay-400">
          🎬 Director: {director || "Unknown"}
        </p>
        <p className="text-sm text-gray-400 mt-1 translate-x-[-20px] group-hover:translate-x-0 transition-transform duration-500 delay-500">
          🎭 Cast: {cast ? cast.join(", ") : "Unknown"}
        </p>
        {streamingOn && (
          <p className="text-sm text-green-400 mt-1 translate-x-[-20px] group-hover:translate-x-0 transition-transform duration-500 delay-600">
            📺 Available on: {streamingOn.join(", ")}
          </p>
        )}

        {/* Button */}
        <button className="mt-3 w-full bg-primary hover:bg-red-600 text-white font-semibold py-2 rounded-md transition duration-300">
          🎟️ Get Tickets
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
