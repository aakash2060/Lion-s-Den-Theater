import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("https://localhost:7027/api/authentication/login", {
        userName: username,
        password: password,
      });

      // Redirect to home page or dashboard after login
      navigate("/");
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full p-2 border rounded mt-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button type="submit" className="w-full mt-4 bg-blue-500 text-white py-2 rounded">
          Login
        </button>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-600">Forgot your password?</Link>
        </div>
        <div className="mt-2 text-center">
          Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
