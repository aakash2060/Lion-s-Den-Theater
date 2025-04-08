import { FaChartBar, FaUsers, FaFilm, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <h1 className="text-4xl font-extrabold text-center mb-10">🎛️ Admin Dashboard</h1>

      {/* Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Site Stats */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
        >
          <div className="flex items-center gap-4 mb-4">
            <FaChartBar className="text-3xl text-yellow-400" />
            <h2 className="text-2xl font-bold">Site Stats</h2>
          </div>
          <p className="text-gray-300">View ticket sales and analytics reports.</p>
          <Link to="/admin-site-stats">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 mt-4 rounded">
              View Stats
            </button>
          </Link>
        </motion.div>

        {/* User Management */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
        >
          <div className="flex items-center gap-4 mb-4">
            <FaUsers className="text-3xl text-blue-400" />
            <h2 className="text-2xl font-bold">Manage Users</h2>
          </div>
          <p className="text-gray-300">View and manage registered users.</p>
          <Link to="/admin-users">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 mt-4 rounded">
              View Users
            </button>
          </Link>
        </motion.div>

        {/* Movie Management */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
        >
          <div className="flex items-center gap-4 mb-4">
            <FaFilm className="text-3xl text-red-400" />
            <h2 className="text-2xl font-bold">Manage Movies</h2>
          </div>
          <p className="text-gray-300">Add, edit, or remove movies from the site.</p>
          <Link to="/admin-manage-movies">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 mt-4 rounded">
              Manage Movies
            </button>
          </Link>
        </motion.div>

        {/* Theater Management */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
        >
          <div className="flex items-center gap-4 mb-4">
            <FaCog className="text-3xl text-green-400" />
            <h2 className="text-2xl font-bold">Manage Theaters</h2>
          </div>
          <p className="text-gray-300">Add, edit, or remove theaters from the system.</p>
          <Link to="/admin-manage-theaters">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded">
              Manage Theaters
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
