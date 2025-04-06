import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theaterService, Theater } from "../../services/api";
import { FaBuilding, FaEdit, FaTrash } from "react-icons/fa";

const AdminManageTheaters = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    theaterService.getAll().then(setTheaters).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await theaterService.delete(id);
      setTheaters((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(
        err?.response?.data ||
        "Failed to delete theater. Make sure it doesn't have associated halls."
      );
    }
  };

  return (
    <div className="p-8 text-white min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold flex items-center gap-2">
          <FaBuilding className="text-4xl text-yellow-400" /> Manage Theaters
        </h1>
        <button
          onClick={() => navigate("/admin-add-theater")}
          className="bg-red-600 hover:bg-red-500 transition px-5 py-2 rounded shadow-lg text-white font-medium"
        >
          ➕ Add New Theater
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-300">Loading theaters...</p>
      ) : theaters.length === 0 ? (
        <p className="text-center text-gray-400">No theaters found. Add one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {theaters.map((theater) => (
            <div
              key={theater.id}
              className="bg-gray-800 rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition duration-300"
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold line-clamp-1">{theater.name}</h2>
                <p className="text-gray-400 text-sm line-clamp-2 mb-2">{theater.address}</p>
                <p className="text-sm text-yellow-300 font-medium">🎟️ Seats: {theater.seatCount}</p>
              </div>
              <div className="flex justify-between gap-2 mt-auto">
                <button
                  onClick={() => navigate(`/admin/edit-theater/${theater.id}`)}
                  className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedId(theater.id);
                    setShowConfirm(true);
                  }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-3">Confirm Deletion</h2>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete this theater? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  handleDelete(selectedId!);
                  setShowConfirm(false);
                }}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageTheaters;