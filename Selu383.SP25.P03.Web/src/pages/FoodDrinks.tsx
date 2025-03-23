import { useState } from "react";
import foodDrinks from "../constants/foodDrinks.json";

const FoodDrinks = () => {
    // State for active category
    const [activeCategory, setActiveCategory] = useState("all");
    
    // Categories
    const categories = [
        { id: "all", name: "All Items", emoji: "🍽️", color: "text-purple-500" },
        { id: "popcorn", name: "Popcorn", emoji: "🍿", color: "text-yellow-500" },
        { id: "snacks", name: "Snacks", emoji: "🥨", color: "text-red-500" },
        { id: "beverages", name: "Beverages", emoji: "🥤", color: "text-blue-500" },
        { id: "combos", name: "Combo Deals", emoji: "🎬", color: "text-green-500" }
    ];
    
    // Filter items based on active category
    const filteredItems = activeCategory === "all" 
        ? foodDrinks 
        : foodDrinks.filter(item => item.category === activeCategory);
    
    // Function to scroll to section
    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {/* Hero Section */}
            <div className="relative h-96 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-800 opacity-80"></div>
                <img 
                    src="/api/placeholder/1920/1080" 
                    alt="Cinema food and drinks" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-5xl font-bold mb-4">Delicious Cinema Treats</h1>
                    <p className="text-xl max-w-2xl">Enhance your movie experience with our premium selection of snacks, popcorn, and refreshing beverages</p>
                </div>
            </div>

            {/* Navigation Tabs - Aligned to Left */}
            <div className="flex justify-start space-x-8 text-lg font-bold ml-10 mt-6 overflow-x-auto pb-2">
                {categories.map(category => (
                    <button 
                        key={category.id}
                        onClick={() => {
                            setActiveCategory(category.id);
                            scrollToSection("menuItems");
                        }} 
                        className={`${category.color} whitespace-nowrap transition-all ${
                            activeCategory === category.id ? "border-b-2 border-current pb-1" : ""
                        }`}
                    >
                        {category.emoji} {category.name}
                    </button>
                ))}
            </div>

            {/* Menu Items Section */}
            <section id="menuItems" className="container mx-auto py-10 px-4">
                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-gray-900 px-4 text-lg font-semibold text-white">
                            {categories.find(cat => cat.id === activeCategory)?.emoji} {categories.find(cat => cat.id === activeCategory)?.name}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                            <div className="h-48 overflow-hidden">
                                <img 
                                    src={item.image || `/api/placeholder/400/300?text=${item.name}`} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold">{item.name}</h3>
                                    <span className="text-xl font-bold text-yellow-500">${item.price.toFixed(2)}</span>
                                </div>
                                <p className="mt-2 text-gray-400">{item.description}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">
                                        {item.category === "popcorn" ? "🍿" : 
                                         item.category === "snacks" ? "🥨" : 
                                         item.category === "beverages" ? "🥤" : "🎬"} {item.size}
                                    </span>
                                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Combo Deals Section */}
            <section className="container mx-auto py-10 px-4">
                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-gray-900 px-4 text-lg font-semibold text-white">🔥 Special Offers</span>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-8 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                            <h2 className="text-3xl font-bold mb-4">🎟️ Movie Night Bundle</h2>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span> 2 Large Popcorns
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span> 2 Large Sodas
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✓</span> 1 Candy of Choice
                                </li>
                                <li className="flex items-center text-yellow-300 font-bold">
                                    <span className="mr-2">✓</span> Save 25% off regular price!
                                </li>
                            </ul>
                            <div className="flex items-center">
                                <span className="text-2xl font-bold mr-4">$19.99</span>
                                <span className="text-gray-400 line-through">$26.99</span>
                                <button className="ml-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-bold transition-colors">
                                    Get Bundle
                                </button>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <img 
                                src="/api/placeholder/600/400" 
                                alt="Movie Night Bundle" 
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>
   
            {/* Membership Benefits */}
            <section className="bg-gradient-to-r from-red-600 to-pink-600 p-10 text-center mt-16">
                <h2 className="text-3xl font-bold">🍿 Lion's Den Plus members get 15% off all concessions!</h2>
                <p className="mt-2">Plus free refills on large popcorn and exclusive monthly treats.</p>
                <button className="mt-4 px-6 py-2 bg-white text-red-600 font-bold rounded-md hover:bg-gray-100 transition-colors">
                    Join Now
                </button>
            </section>
        </div>
    );
};

export default FoodDrinks;