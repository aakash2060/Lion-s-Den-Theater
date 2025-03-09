import { Link } from "react-router-dom";
import { FaUser, FaSearch } from "react-icons/fa";

const Navbar = () => {
  const navLinks = [
    { id: 1, name: "Discover Movies", path: "/discover-movies" },
    { id: 2, name: "Food & Drinks", path: "/food-drinks" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white px-8 py-4 flex items-center justify-between shadow-md border-b border-gray-700">
      {/* Left Section - Logo */}
      <div className="flex items-center space-x-4">
        <img src="/vite.svg" alt="Logo" className="h-10 w-auto" />
        <Link to="/" className="text-lg font-bold hover:text-teal-400 transition duration-200">
          Lion's Den
        </Link>
      </div>

      {/* Center Section - Navigation Links */}
      <div className="flex space-x-16 text-lg font-semibold">
        {navLinks.map(({ id, name, path }) => (
          <Link
            key={id}
            to={path}
            className="hover:text-teal-400 transition duration-200"
          >
            {name}
          </Link>
        ))}
      </div>

      {/* Right Section - Search Bar & Profile */}
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center bg-gray-800 px-3 py-1 rounded-md">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search movies..."
            className="bg-gray-800 text-white border-none outline-none w-32 placeholder-gray-400"
          />
        </div>
        <FaUser className="text-xl hover:text-teal-400 cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;
