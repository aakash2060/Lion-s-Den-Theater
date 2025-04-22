import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen flex items-center justify-center text-white px-4 py-12">
      <div className="max-w-3xl w-full text-center space-y-8 animate-fade-in">
        <div className="flex justify-center">
          <CheckCircle className="text-green-500 w-20 h-20" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Thank You for Your Purchase!
        </h1>

        <p className="text-lg md:text-xl text-gray-300">
          Your ticket has been sent to your email. 🎟️<br />
          We hope you enjoy the show!
        </p>

        <div className="pt-6">
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 transition-colors px-8 py-3 rounded-full font-semibold text-lg shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
