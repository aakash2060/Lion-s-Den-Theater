import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./pages/Home";
import DiscoverMovies from "./pages/DiscoverMovies";
import FoodDrinks from "./pages/FoodDrinks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="main-content flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/discover-movies" element={<DiscoverMovies />} />
            <Route path="/food-drinks" element={<FoodDrinks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> 
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
