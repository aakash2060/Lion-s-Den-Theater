import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom"; 


const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <h2 className="text-2xl font-semibold animate-pulse">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="w-full max-w-md bg-black bg-opacity-80 backdrop-blur-md shadow-lg rounded-lg p-8 border border-gray-700">
        {/* Profile Avatar */}
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full flex items-center justify-center bg-gray-700 text-3xl font-bold shadow-md text-white border-4 border-gray-500">
            {user.userName?.charAt(0)?.toUpperCase()}
          </div>
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-bold text-center mt-4">{user.userName}</h2>
        <p className="text-gray-400 text-center">{user.roles?.join(", ")}</p>

        {/* Admin Dashboard Button */}
        {user.roles?.includes("Admin") && (
  <Link
    to="/admin-dashboard"
    className="w-full mt-4 py-3 bg-red-600 hover:bg-blue-500 transition-all text-white font-semibold rounded-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500"
  >
    🛠️ Admin Dashboard
  </Link>
)}

       
        {/* Logout Button */}
        <button
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className="w-full mt-4 py-3 bg-red-600 hover:bg-red-500 transition-all text-white font-semibold rounded-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-500"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
