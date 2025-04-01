import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useTheater } from "../context/TheaterContext";
import { theaterService, Theater } from "../services/api";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [theatersList, setTheatersList] = useState<Theater[]>([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setSearchTerm } = useSearch();
  const { theater, setTheater } = useTheater();

  const navLinks = [
    { id: 1, name: "Discover Movies", path: "/discover-movies" },
    { id: 2, name: "Food & Drinks", path: "/food-drinks" },
  ];

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const data = await theaterService.getAll();
        setTheatersList(data);
      } catch (err) {
        console.error("Failed to load theaters:", err);
      }
    };

    fetchTheaters();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed) return;

    setSearchTerm(trimmed);
    navigate("/search");
    setSearchInput("");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-90 backdrop-blur-md text-white px-8 py-4 flex items-center justify-between shadow-md border-b border-gray-700 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <img src="/logos.png" alt="Logo" className="h-15 w-auto" />
        <Link
          to="/"
          className="text-lg font-bold text-white hover:text-primary transition duration-200"
        >
          Lion's Den
        </Link>
      </div>

      {/* Nav Links */}
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

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* 🎬 Theater Dropdown */}
        <div className="hidden md:block">
          <select
            value={theater?.id.toString() ?? ""}
            onChange={(e) => {
              const selected = theatersList.find(
                (t) => t.id.toString() === e.target.value
              );
              if (selected) setTheater(selected);
            }}
            className="bg-gray-800 text-white px-3 py-1 rounded-md border border-gray-600 focus:outline-none"
          >
            <option value="" disabled hidden>🎬 Select Theater</option>
            {theatersList.map((t) => (
              <option key={t.id} value={t.id.toString()}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🔍 Search */}
        <form
          onSubmit={handleSearch}
          className="relative hidden md:flex items-center bg-gray-800 px-3 py-1 rounded-md border border-gray-600 focus-within:border-primary"
        >
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search movies..."
            className="bg-transparent text-white border-none outline-none w-32 placeholder-gray-400 focus:w-40 transition-all"
          />
        </form>

        {/* 👤 Profile */}
        <div className="relative hidden md:block">
          <button
            className="text-xl text-white hover:text-primary transition duration-200"
            onClick={() => {
              if (!user) {
                navigate("/login");
              } else {
                setProfileMenuOpen(!profileMenuOpen);
              }
            }}
          >
            <FaUser />
          </button>

          {profileMenuOpen && user && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setProfileMenuOpen(false);
                  navigate("/login");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* 🍔 Mobile Menu */}
        <button
          className="text-2xl text-white md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* 📱 Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-900 backdrop-blur-md flex flex-col items-center justify-center space-y-10 z-40 transition-all duration-300">
          <button
            className="absolute top-5 right-5 text-3xl text-white"
            onClick={() => setMenuOpen(false)}
          >
            <FaTimes />
          </button>

          {navLinks.map(({ id, name, path }) => (
            <Link
              key={id}
              to={path}
              className="text-3xl font-medium text-white hover:text-[#ef4444]"
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </Link>
          ))}

          <div className="flex items-center space-x-6 mt-10">
            <FaSearch className="text-3xl text-white cursor-pointer" />
            <FaUser
              className="text-3xl text-white cursor-pointer"
              onClick={() => {
                setMenuOpen(false);
                navigate(user ? "/profile" : "/login");
              }}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
