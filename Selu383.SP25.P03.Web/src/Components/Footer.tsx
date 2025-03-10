import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 text-center py-8 border-t border-gray-700 mt-auto">
      <div className="container mx-auto px-6">
        {/* Logo & Branding */}
        <h2 className="text-white text-2xl font-bold">🎬 Lion's Den Theater</h2>
        <p className="text-sm text-gray-500">Your Ultimate Movie Experience</p>

        {/* Quick Links */}
        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="/discover-movies"
            className="hover:text-primary transition duration-300"
          >
            Discover Movies
          </a>
          <a
            href="/food-drinks"
            className="hover:text-primary transition duration-300"
          >
            Food & Drinks
          </a>
          <a
            href="/membership"
            className="hover:text-primary transition duration-300"
          >
            Membership
          </a>
          <a
            href="/contact"
            className="hover:text-primary transition duration-300"
          >
            Contact Us
          </a>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mt-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition duration-300"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition duration-300"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-pink-500 transition duration-300"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-red-500 transition duration-300"
          >
            <FaYoutube size={24} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Lion's Den Theater. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
