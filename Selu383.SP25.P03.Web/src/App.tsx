import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./pages/Home";
import DiscoverMovies from "./pages/DiscoverMovies";
import FoodDrinks from "./pages/FoodDrinks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MovieDescriptionPage from "./pages/MovieDescription";
import SearchResults from "./pages/SearchResult";
import "./index.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers"; 
import AdminManageMovies from "./pages/AdminManageMovies"; 


const App = () => {
  return (
    <AuthProvider>
      <SearchProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="main-content flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover-movies" element={<DiscoverMovies />} />
              <Route path="/food-drinks" element={<FoodDrinks />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<SearchResults />} />
              
              {/* Update the route to use ID parameter */}
              <Route path="/movie/:id" element={<MovieDescriptionPage />} />
              
              {/* Keep the old route temporarily for backward compatibility */}
              <Route path="/movie-description/:movieName" element={<MovieDescriptionPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-users" element={<AdminUsers />} />
              <Route path="/admin-manage-movies" element={<AdminManageMovies />} />


            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;