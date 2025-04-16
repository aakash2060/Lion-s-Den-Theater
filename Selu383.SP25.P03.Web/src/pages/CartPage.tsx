import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartList, setCartList] = useState<any[]>([]);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("orderCart") || "[]");
    setCartList(cartData);
  }, []);

  const getItemTotal = (item: any) => {
    const ticketTotal = item.showtime.price * item.selectedSeats.length;
    const foodTotal = Object.values(item.foodCart || {}).reduce(
      (acc: number, foodItem: any) => acc + foodItem.foodItem.price * foodItem.quantity,
      0
    );
    return ticketTotal + foodTotal;
  };

  const getCartTotal = () => {
    return cartList.reduce((acc: number, order: any) => acc + getItemTotal(order), 0);
  };

  const removeItem = (index: number) => {
    const updatedCart = [...cartList];
    updatedCart.splice(index, 1);
    localStorage.setItem("orderCart", JSON.stringify(updatedCart));
    setCartList(updatedCart);
  };

  return (
    <div className="bg-gradient-to-br from-gray-950 to-black min-h-screen text-white py-12 px-4 md:px-10 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-6 text-center">Cart Summary</h1>

        {cartList.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div>
            {cartList.map((order, idx) => (
              <div key={`order-${idx}`} className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-6 mb-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center space-x-6">
                  {/* Movie Poster */}
                  <img src={order.showtime.moviePoster} alt={order.showtime.movieTitle} className="w-32 h-48 rounded-lg shadow-md" />

                  <div className="flex flex-col space-y-2">
                    {/* Showtime and Ticket Info */}
                    <h2 className="text-xl font-semibold text-white">{order.showtime.movieTitle}</h2>
                    <p className="text-sm text-gray-400">{new Date(order.showtime.startTime).toLocaleDateString()} - {new Date(order.showtime.startTime).toLocaleTimeString()}</p>
                    <p className="text-sm text-gray-400">Seats: {order.selectedSeats.join(", ")}</p>
                    <p className="text-base font-semibold">Price: ${order.showtime.price.toFixed(2)} per ticket</p>
                    <p className="text-lg font-bold">Total: ${order.showtime.price * order.selectedSeats.length}</p>
                  </div>

                  <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 ml-auto">
                    <FaTrashAlt className="w-6 h-6" /> Remove
                  </button>
                </div>

                {/* Food Items Section */}
                <div className="mt-4 bg-gray-800 rounded-xl p-4">
                  <h3 className="text-xl font-semibold text-white">Food & Drinks</h3>
                  {Object.keys(order.foodCart).length > 0 ? (
                    Object.values(order.foodCart).map((foodItem: any, index: number) => (
                      <div key={`food-${index}`} className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-sm text-white">{foodItem.foodItem.name} × {foodItem.quantity}</span>
                        <span className="text-sm text-white">${(foodItem.foodItem.price * foodItem.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No food items added.</p>
                  )}
                </div>
              </div>
            ))}

            {/* Cart Total */}
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg mt-8">
              <div className="flex justify-between font-bold text-xl">
                <span>Total Cart Value:</span>
                <span className="text-lg">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate("/checkout")}
                className="bg-green-600 text-white hover:bg-green-700 px-8 py-4 rounded-lg font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
