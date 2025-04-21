import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShowtimeDetail } from '../Data/ShowtimeInterfaces';
import { FoodItem } from '../Data/FoodItem';
import { fetchFoodMenus } from '../services/FoodApi';

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

  const handleProceedToCart = () => {
    navigate('/cart', {
      state: {
        totalPrice: calculateTotalWithFood(),
        selectedSeats,
        foodCart: cart
      }
    });
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
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen p-6 flex gap-6">
      <div className="max-w-3xl flex-grow mr-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-green-900 rounded-lg p-6 mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-4">Order Summary</h1>
        </motion.div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{showtime.movieTitle}</h2>
            <img
              src={showtime.moviePoster}
              alt={showtime.movieTitle}
              className="w-40 h-auto mx-auto rounded-lg mb-4 object-contain"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="mb-2"><span className="font-semibold">Theater:</span> {showtime.theaterName}</p>
                <p className="mb-2"><span className="font-semibold">Hall:</span> {showtime.hallNumber}</p>
                <p className="mb-2"><span className="font-semibold">Date:</span> {new Date(showtime.startTime).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="mb-2"><span className="font-semibold">Time:</span> {new Date(showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="mb-2"><span className="font-semibold">Format:</span> {showtime.is3D ? '3D' : '2D'}</p>
                <p className="mb-2"><span className="font-semibold">Price per ticket:</span> ${showtime.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Your Order</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 text-left w-1/2">Item</th>
                  <th className="py-2 text-left w-1/2">Price</th>
                </tr>
              </thead>
              <tbody>
                {/* Seat Rows */}
                {selectedSeats.map((seat, index) => (
                  <tr key={`seat-${index}`} className="border-b border-gray-700">
                    <td className="py-3 text-left">Seat: {seat}</td>
                    <td className="py-3 text-left">${showtime.price.toFixed(2)}</td>
                  </tr>
                ))}

                {/* Food Rows */}
                {Object.values(cart).map((item, index) => (
                  <tr key={`food-${index}`} className="border-b border-gray-700">
                    <td className="py-3 text-left">
                      {item.foodItem.name} × {item.quantity}
                    </td>
                    <td className="py-3 text-left">
                      ${(item.foodItem.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td className="py-3 font-bold text-left">Total</td>
                  <td className="py-3 font-bold text-left">${calculateTotalWithFood().toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate('/home')} 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-semibold"
          >
            Return to Home
          </button>
          <button 
            onClick={handleProceedToCart}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md font-semibold"
          >
            Go to Cart
          </button>
        </div>
      </div>

      <div className="w-[30rem] p-4 bg-gray-800 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-center mb-6">Add Food & Drinks</h3>
        <div className="space-y-4 overflow-y-auto max-h-[90vh] pr-2">
          {menus.map((menu) => (
            <div key={menu.id}>
              <h4 className="text-xl font-semibold text-center bg-gradient-to-r from-red-600 to-purple-600 inline-block px-4 py-2 rounded-md mb-4">{menu.name}</h4>
              {menu.foodMenuItems.map((item: any) => (
                <div key={item.foodItem.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow-md mb-4">
                  <div className="flex items-center">
                    <img src={item.foodItem.imgUrl} alt={item.foodItem.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                    <div>
                      <p className="text-xl font-semibold">{item.foodItem.name}</p>
                      <p className="text-sm text-gray-400">{item.foodItem.description}</p>
                      <p className="text-lg font-bold text-red-400">${item.foodItem.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleRemoveFood(item.foodItem)}
                      className="bg-red-600 text-white p-2 rounded-full"
                    >–</button>
                    <span className="text-xl">{cart[item.foodItem.id]?.quantity || 0}</span>
                    <button 
                      onClick={() => handleAddFood(item.foodItem)}
                      className="bg-green-600 text-white p-2 rounded-full"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
