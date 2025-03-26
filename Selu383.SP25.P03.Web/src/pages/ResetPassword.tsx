import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const location = useLocation();
  const email = location.state?.email || ""; // Get email from previous page
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "/api/users/resetpassword",
        { email, token, newPassword },
        { withCredentials: true }
      );
      setMessage(response.data);
    } catch (err) {
      setError("Failed to reset password.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="w-full max-w-md bg-black bg-opacity-70 backdrop-blur-md shadow-lg rounded-lg p-8 border border-gray-700">
        <div className="flex justify-center">
          <img src="/logos.png" alt="Logo" className="h-12 mb-4" />
        </div>

        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

        {message && <p className="text-green-500 text-sm text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <p className="text-gray-400 text-sm mb-4 text-center">{email}</p>

          <input
            type="text"
            placeholder="Enter token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 outline-none mb-3"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 outline-none mb-3"
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 transition-all py-2 mt-4 rounded-md text-white font-semibold"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
