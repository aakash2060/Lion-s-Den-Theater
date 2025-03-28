import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { movieService } from "../../services/api"; 

interface Movie {
  id: number;
  title: string;
  description: string;
  director: string;
  duration: number;
  rating: string;
  posterUrl: string;
  releaseDate: string;
  genre: string;
}

const AdminManageMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getAll();
        setMovies(data);
      } catch (err) {
        console.error("Error fetching movies", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await movieService.delete(id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert("Error deleting movie: " + (err?.response?.data || "Unknown error"));
    }
  };

  return (
    <div className="p-8 text-white min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">🎬 Manage Movies</h1>
        <button
          onClick={() => navigate("/admin-add-movie")}
          className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded shadow-lg"
        >
          ➕ Add New Movie
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading movies...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-64 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder-poster.jpg";
                }}
              />
              <h2 className="text-xl font-semibold mt-2">{movie.title}</h2>
              <p className="text-gray-400 text-sm">
                {movie.genre} | {new Date(movie.releaseDate).toDateString()}
              </p>
              <p className="text-sm mt-1 line-clamp-3">{movie.description}</p>

              <div className="flex justify-between mt-auto pt-4">
                <button className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-500">
                  Edit
                </button>
                <button
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
                  onClick={() => handleDelete(movie.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminManageMovies;
