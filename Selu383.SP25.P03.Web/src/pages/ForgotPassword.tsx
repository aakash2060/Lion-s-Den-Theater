import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "/api/users/forgotpassword",
        { email, clientUri: window.location.origin },
        { withCredentials: true }
      );
      setMessage(response.data);
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1000);
    } catch (err) {
      setError("Error sending password reset email. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="w-full max-w-md bg-black bg-opacity-70 backdrop-blur-md shadow-lg rounded-lg p-8 border border-gray-700">
        <div className="flex justify-center">
          <img src="/logos.png" alt="Logo" className="h-12 mb-4" />
        </div>

        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 outline-none mb-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {message && <p className="text-green-500 text-sm text-center">{message}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 transition-all py-2 mt-4 rounded-md text-white font-semibold"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-gray-400 hover:text-red-400 transition">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
