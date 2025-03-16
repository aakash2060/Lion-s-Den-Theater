import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("https://localhost:7027/api/users", {
        firstName,
        lastName,
        userName: username,
        email,
        password,
        roles: ["User"],
      });

      navigate("/login"); 
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>

        <input type="text" className="w-full p-2 border rounded" placeholder="First Name" 
               value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <input type="text" className="w-full p-2 border rounded mt-2" placeholder="Last Name" 
               value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <input type="text" className="w-full p-2 border rounded mt-2" placeholder="Username" 
               value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" className="w-full p-2 border rounded mt-2" placeholder="Email" 
               value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="w-full p-2 border rounded mt-2" placeholder="Password" 
               value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" className="w-full p-2 border rounded mt-2" placeholder="Confirm Password" 
               value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button type="submit" className="w-full mt-4 bg-green-500 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
