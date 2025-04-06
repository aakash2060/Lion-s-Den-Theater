import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { movieService } from "../../services/api";

interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  genre: string;
  rating: string;
}

const AdminEditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await movieService.getById(Number(id));
        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!movie?.title) newErrors.title = "Title is required.";
    if (
      !movie?.posterUrl ||
      !/^https?:\/\/.*\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(movie.posterUrl)
    )
      newErrors.posterUrl = "Valid image URL required.";
    if (!movie?.genre) newErrors.genre = "Genre is required.";
    if (!movie?.rating) newErrors.rating = "Rating is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!movie) return;
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await movieService.update(movie!.id, movie!);
      navigate("/admin/manage-movies");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading || !movie)
    return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-800 rounded-xl shadow-md text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Movie</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            name="title"
            value={movie.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="Enter title"
          />
          {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={movie.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="Enter description"
          />
        </div>

        <div>
          <label className="block font-medium">Poster URL</label>
          <input
            name="posterUrl"
            value={movie.posterUrl}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="https://example.com/poster.jpg"
          />
          {errors.posterUrl && (
            <p className="text-red-400 text-sm">{errors.posterUrl}</p>
          )}
          {movie.posterUrl && (
            <img
              src={movie.posterUrl}
              alt="Preview"
              className="mt-2 h-40 object-contain rounded border border-gray-600"
            />
          )}
        </div>

        <div>
          <label className="block font-medium">Genre</label>
          <input
            name="genre"
            value={movie.genre}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="Action, Comedy, etc."
          />
          {errors.genre && (
            <p className="text-red-400 text-sm">{errors.genre}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Rating</label>
          <input
            name="rating"
            value={movie.rating}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="PG, PG-13, R..."
          />
          {errors.rating && (
            <p className="text-red-400 text-sm">{errors.rating}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdminEditMovie;
