import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { movieService } from "../../services/api";

const AdminAddMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    director: "",
    duration: 120,
    rating: "",
    posterUrl: "",
    releaseDate: "",
    genre: ""
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await movieService.create(formData);
      navigate("/admin-manage-movies");
    } catch (err: any) {
      setError(err?.response?.data || "Unknown error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">🎥 Add New Movie</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg"
      >
        <input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Movie Title"
          required
          className="w-full p-3 rounded bg-gray-900 border border-gray-700"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
          className="w-full p-3 rounded bg-gray-900 border border-gray-700"
          rows={4}
        />

        <input
          name="director"
          value={formData.director}
          onChange={handleInputChange}
          placeholder="Director"
          className="w-full p-3 rounded bg-gray-900 border border-gray-700"
        />

        <div>
          <label className="block mb-1 text-sm text-gray-400">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
            min={1}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-400">Rating</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleSelectChange}
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
          >
            <option value="">Select Rating</option>
            <option value="G">G</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
            <option value="NC-17">NC-17</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-400">Poster URL</label>
          <input
            name="posterUrl"
            value={formData.posterUrl}
            onChange={handleInputChange}
            placeholder="Poster URL"
            required
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
          />
          {formData.posterUrl && (
            <img
              src={formData.posterUrl}
              alt="Preview"
              className="mt-3 max-h-64 rounded border border-gray-600"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder-poster.jpg";
              }}
            />
          )}
        </div>

        <input
          type="date"
          name="releaseDate"
          value={formData.releaseDate}
          onChange={handleInputChange}
          className="w-full p-3 rounded bg-gray-900 border border-gray-700"
          required
        />

        <div>
          <label className="block mb-1 text-sm text-gray-400">Genre</label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleSelectChange}
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
            required
          >
            <option value="">Select Genre</option>
            <option value="Action">Action</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Animation">Animation</option>
            <option value="Horror">Horror</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-[#f0c434] hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold shadow-lg w-full transition-transform transform hover:scale-105"
        >
          ➕ Create Movie
        </button>
      </form>
    </div>
  );
};

export default AdminAddMovie;
