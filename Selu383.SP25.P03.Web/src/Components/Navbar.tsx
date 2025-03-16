import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSearch, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { id: 1, name: "Discover Movies", path: "/discover-movies" },
    { id: 2, name: "Food & Drinks", path: "/food-drinks" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-90 backdrop-blur-md text-white px-8 py-4 flex items-center justify-between shadow-md border-b border-gray-700 z-50">
      {/* Left Section - Logo */}
      <div className="flex items-center space-x-4">
        <img src="/logos.png" alt="Logo" className="h-15 w-auto" />
        <Link
          to="/"
          className="text-lg font-bold text-white hover:text-primary transition duration-200"
        >
          Lion's Den
        </Link>
      </div>

      {/* Center Section - Desktop Navigation */}
      <div className="hidden md:flex space-x-16 text-lg font-semibold">
        {navLinks.map(({ id, name, path }) => (
          <Link
            key={id}
            to={path}
            className="hover:text-[#ef4444] transition duration-200"
          >
            {name}
          </Link>
        ))}
      </div>

      {/* Right Section - Search Bar & Profile */}
      <div className="flex items-center space-x-4">
        {/* Desktop Search Bar */}
        <div className="relative hidden md:flex items-center bg-gray-800 px-3 py-1 rounded-md border border-gray-600 focus-within:border-primary">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search movies..."
            className="bg-transparent text-white border-none outline-none w-32 placeholder-gray-400 focus:w-40 transition-all"
          />
        </div>

        {/* Profile Icon - Redirects to Login for Now */}
        <FaUser
          className="text-xl text-white hover:text-primary cursor-pointer transition duration-200 hidden md:block"
          onClick={() => navigate("/login")} 
        />

        {/* Hamburger Menu Button - Visible Only on Mobile */}
        <button
          className="text-2xl text-white md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-900 backdrop-blur-md flex flex-col items-center justify-center space-y-10 z-40 transition-all duration-300">
          {/* Close Button */}
          <button
            className="absolute top-5 right-5 text-3xl text-white"
            onClick={() => setMenuOpen(false)}
          >
            <FaTimes />
          </button>

          {/* Mobile Menu Links */}
          {navLinks.map(({ id, name, path }) => (
            <Link
              key={id}
              to={path}
              className="text-3xl font-medium text-white hover:text-primary transition duration-200 hover:text-[#ef4444]"
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </Link>
          ))}

          {/* Search & Profile in Mobile Menu */}
          <div className="flex items-center space-x-6 mt-10">
            <FaSearch className="text-3xl text-white cursor-pointer" />
            <FaUser
              className="text-3xl text-white cursor-pointer"
              onClick={() => {
                setMenuOpen(false);
                navigate("/login");
              }}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
