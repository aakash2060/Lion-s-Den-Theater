import { FaChartBar, FaUsers, FaFilm, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <h1 className="text-4xl font-extrabold text-center mb-10">🎛️ Admin Dashboard</h1>

      {/* Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Stats Panel */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
        >
          <div className="flex items-center gap-4 mb-4">
            <FaChartBar className="text-3xl text-yellow-400" />
            <h2 className="text-2xl font-bold">Site Stats</h2>
          </div>
          <p className="text-gray-300">Active Users: 1,204</p>
          <p className="text-gray-300">Bookings Today: 58</p>
          <p className="text-gray-300">Revenue: $4,320</p>
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
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded text-sm font-medium">
            View Users
          </button>
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
          <button className="mt-4 bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded text-sm font-medium">
            Manage Movies
          </button>
        </motion.div>

        {/* Settings */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
        >
          <div className="flex items-center gap-4 mb-4">
            <FaCog className="text-3xl text-green-400" />
            <h2 className="text-2xl font-bold">Site Settings</h2>
          </div>
          <p className="text-gray-300">Customize theme, email preferences, and more.</p>
          <button className="mt-4 bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded text-sm font-medium">
            Open Settings
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
