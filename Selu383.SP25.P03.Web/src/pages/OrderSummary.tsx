import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShowtimeDetail } from '../Data/ShowtimeInterfaces';
import { FoodItem } from '../Data/FoodItem';
import { fetchFoodMenus } from '../services/FoodApi';
import { CheckCircle, ArrowRightCircle } from 'lucide-react';

interface LocationState {
  showtime: ShowtimeDetail;
  selectedSeats: string[];
  totalPrice: number;
}

interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

const OrderSummary: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showtime, selectedSeats, totalPrice } = location.state as LocationState || {};

  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getFoodMenus = async () => {
      try {
        const data = await fetchFoodMenus();
        setMenus(data);
      } catch (err) {
        setError('Failed to fetch food menus');
      } finally {
        setLoading(false);
      }
    };
    getFoodMenus();
  }, []);

  const handleAddFood = (foodItem: FoodItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart[foodItem.id];
      if (existingItem) {
        return {
          ...prevCart,
          [foodItem.id]: { foodItem, quantity: existingItem.quantity + 1 }
        };
      }
      return { ...prevCart, [foodItem.id]: { foodItem, quantity: 1 } };
    });
  };

  const handleRemoveFood = (foodItem: FoodItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart[foodItem.id];
      if (existingItem && existingItem.quantity > 1) {
        return {
          ...prevCart,
          [foodItem.id]: { foodItem, quantity: existingItem.quantity - 1 }
        };
      }
      const updatedCart = { ...prevCart };
      delete updatedCart[foodItem.id];
      return updatedCart;
    });
  };

  const calculateTotalWithFood = () => {
    let total = totalPrice;
    Object.values(cart).forEach((item) => {
      total += item.foodItem.price * item.quantity;
    });
    return total;
  };

  const handleAddToCart = () => {
    const currentCart = {
      selectedSeats,
      showtime,
      foodCart: cart,
      totalPrice: calculateTotalWithFood(),
    };

    // Retrieve existing cart data from localStorage
    let existingCart = JSON.parse(localStorage.getItem('orderCart') || '[]');

    // Ensure that existingCart is always an array
    if (!Array.isArray(existingCart)) {
      console.warn('Invalid cart data in localStorage, resetting cart.');
      existingCart = []; // Reset to an empty array if not valid
    }

    // Add the new cart to the existing array
    const updatedCart = [...existingCart, currentCart];
    console.log('Updated Cart:', updatedCart); // Debugging to ensure it looks correct

    // Store the updated cart back into localStorage
    localStorage.setItem('orderCart', JSON.stringify(updatedCart));

    // Navigate to the cart page
    navigate('/cart');
  };

  if (loading) return <div className="text-center text-white text-xl py-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-xl py-20">{error}</div>;

  if (!showtime || !selectedSeats) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen flex items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-red-500 mb-4">No Order Information</h2>
        <p className="text-gray-300 mb-6">We couldn't find your order information.</p>
        <button 
          onClick={() => navigate('/home')} 
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-950 to-black text-white min-h-screen p-6 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-2/3 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-green-900 text-center rounded-xl py-4 shadow-xl"
        >
          <h1 className="text-4xl font-bold tracking-wide flex justify-center items-center gap-2">
            <CheckCircle className="w-7 h-7 text-white" /> Order Summary
          </h1>
        </motion.div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">{showtime.movieTitle}</h2>
            <img
              src={showtime.moviePoster}
              alt={showtime.movieTitle}
              className="w-48 h-auto mx-auto rounded-xl border border-gray-700 shadow-md mb-4"
            />
            <div className="grid grid-cols-2 gap-6 text-left mt-4 text-sm">
              <div>
                <p><span className="font-semibold text-gray-400">🎬 Theater:</span> {showtime.theaterName}</p>
                <p><span className="font-semibold text-gray-400">🛋️ Hall:</span> {showtime.hallNumber}</p>
                <p><span className="font-semibold text-gray-400">📅 Date:</span> {new Date(showtime.startTime).toLocaleDateString()}</p>
              </div>
              <div>
                <p><span className="font-semibold text-gray-400">🕒 Time:</span> {new Date(showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p><span className="font-semibold text-gray-400">📽️ Format:</span> {showtime.is3D ? '3D' : '2D'}</p>
                <p><span className="font-semibold text-gray-400">🎟️ Ticket Price:</span> ${showtime.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">🎫 Your Seats & Snacks</h3>
          <div className="space-y-3">
            {selectedSeats.map((seat, index) => (
              <div key={`seat-${index}`} className="flex justify-between text-sm">
                <span>Seat: <span className="text-yellow-400 font-semibold">{seat}</span></span>
                <span>${showtime.price.toFixed(2)}</span>
              </div>
            ))}
            {Object.values(cart).map((item, index) => (
              <div key={`food-${index}`} className="flex justify-between text-sm">
                <span>{item.foodItem.name} × {item.quantity}</span>
                <span>${(item.foodItem.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-600 pt-3 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${calculateTotalWithFood().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate('/home')} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-semibold">
            Return to Home
          </button>
          <button onClick={handleAddToCart} className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-md font-semibold flex items-center gap-2">
            Add to Cart <ArrowRightCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="w-full lg:w-1/3 p-4 bg-gray-800 rounded-lg shadow-xl h-fit max-h-screen overflow-y-auto">
        <h3 className="text-2xl font-bold text-center mb-6">🍿 Add Food & Drinks</h3>
        {menus.map((menu) => (
          <div key={menu.id} className="mb-6">
            <h4 className="text-lg font-semibold text-center text-white bg-gradient-to-r from-red-600 to-purple-600 inline-block px-4 py-1 rounded-full mb-4">{menu.name}</h4>
            {menu.foodMenuItems.map((item: any) => (
              <div key={item.foodItem.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow-md mb-4">
                <div className="flex items-center">
                  <img src={item.foodItem.imgUrl} alt={item.foodItem.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                  <div>
                    <p className="text-lg font-semibold">{item.foodItem.name}</p>
                    <p className="text-sm text-gray-400">{item.foodItem.description}</p>
                    <p className="text-base font-bold text-red-400">${item.foodItem.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleRemoveFood(item.foodItem)} className="bg-red-600 text-white px-3 py-1 rounded-full">–</button>
                  <span className="text-lg font-semibold">{cart[item.foodItem.id]?.quantity || 0}</span>
                  <button onClick={() => handleAddFood(item.foodItem)} className="bg-green-600 text-white px-3 py-1 rounded-full">+</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSummary;
