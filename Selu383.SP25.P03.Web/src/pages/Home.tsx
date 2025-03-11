import MovieCarousel from "../Components/MovieCarousel";
import MovieCard from "../Components/MovieCard";
import movies from "../constants/movies.json";

const Home = () => {
    // Filter movies into categories
    const nowShowing = movies.filter(movie => new Date(movie.release_date) <= new Date());
    const comingSoon = movies.filter(movie => new Date(movie.release_date) > new Date());
    const topRated = [...movies]
        .filter(movie => movie.rating) // Ensure rating exists
        .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)) // Sort by rating (highest first)
        .slice(0, 5); // Show top 5 rated movies

    // Function to scroll to section
    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="bg-gray-900 text-white">
            {/* Hero Section */}
            <MovieCarousel />

            {/* Navigation Tabs - Aligned to Left */}
            <div className="flex justify-start space-x-8 text-lg font-bold ml-10 mt-6">
                <button onClick={() => scrollToSection("nowPlaying")} className="text-red-500">🎬 Now Playing</button>
                <button onClick={() => scrollToSection("comingSoon")} className="text-blue-500">🚀 Coming Soon</button>
                <button onClick={() => scrollToSection("topRated")} className="text-yellow-500">⭐ Top Rated</button>
            </div>

            {/* Now Playing Section */}
            <section id="nowPlaying" className="container mx-auto py-10">
                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-gray-900 px-4 text-lg font-semibold text-white">🎬 Now Playing</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {nowShowing.map((movie, index) => (
                        <MovieCard key={index} {...movie} />
                    ))}
                </div>
            </section>

            {/* Coming Soon Section */}
            <section id="comingSoon" className="container mx-auto py-10">
                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-gray-900 px-4 text-lg font-semibold text-white">🚀 Coming Soon</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {comingSoon.map((movie, index) => (
                        <MovieCard key={index} {...movie} />
                    ))}
                </div>
            </section>

            {/* Top Rated Section */}
            <section id="topRated" className="container mx-auto py-10">
                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-gray-900 px-4 text-lg font-semibold text-white">⭐ Top Rated</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {topRated.map((movie, index) => (
                        <MovieCard key={index} {...movie} />
                    ))}
                </div>
            </section>

            {/* Exclusive Offers & Membership */}
            <section className="bg-gradient-to-r from-red-600 to-pink-600 p-10 text-center mt-16">
                <h2 className="text-3xl font-bold">🎟️ Get early access, discounts, and more with Lion’s Den Plus.</h2>
                <p className="mt-2">Unlock unlimited movies and exclusive perks.</p>
                <button className="mt-4 px-6 py-2 bg-white text-red-600 font-bold rounded-md">Join Now</button>
            </section>
        </div>
    );
};

export default Home;
