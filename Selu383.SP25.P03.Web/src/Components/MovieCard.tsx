import React from "react";

interface MovieProps {
  name: string;
  duration: string;
  release_date: string;
  image: string;
}

const MovieCard: React.FC<MovieProps> = ({ name, duration, release_date, image }) => {
  return (
    <div className="w-64 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
      {/* Movie Image */}
      <img className="w-full h-48 object-cover" src={image} alt={name} />
      
      {/* Movie Details */}
      <div className="p-4">
        <h5 className="text-lg font-bold text-gray-900">{name}</h5>
        <p className="text-sm text-gray-600 mt-1">⏳ {duration}</p>
        <p className="text-sm text-gray-600 mt-1">📅 {release_date}</p>

        {/* Button */}
        <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition duration-300">
          Get Tickets
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
