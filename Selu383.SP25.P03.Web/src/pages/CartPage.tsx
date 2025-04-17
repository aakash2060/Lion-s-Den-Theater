import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { cartService } from "../services/CartApi";
import { CartDto, CartItemDto } from "../Data/CartInterfaces";
import { useAuth } from "../context/AuthContext";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const {user, isAuthenticated} = useAuth();

  const userIdFromQuery = searchParams.get('userId');
  const userId = userIdFromQuery ? parseInt(userIdFromQuery) : (user ? user.id : null);

  useEffect(() => {
    if (!isAuthenticated && !userIdFromQuery) {
      navigate('/login', { state: { returnUrl: location.pathname } });
    }
  }, [isAuthenticated, navigate, location.pathname, userIdFromQuery]);

  useEffect(() => {
    const fetchCart = async () => {

      if (!userId) {
        setError("User ID is missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const cartData = await cartService.getCart(userId);
        setCart(cartData);
      } catch (err) {
        setError("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  const getItemTotal = (item: CartItemDto) => item.totalPrice;

  const getCartTotal = () => {
    return cart?.items.reduce((acc: number, item: CartItemDto) => acc + getItemTotal(item), 0) || 0;
  };

  const handleRemoveItem = async (cartItemId: number) => {

    if (!userId) {
      setError("User ID is missing. Please log in.");
      return;
    }

    try {
      const updatedCart = await cartService.removeFromCart(userId, cartItemId);
      setCart(updatedCart);
    } catch (err) {
      setError("Failed to remove item from cart.");
    }
  };

  if (!userId) {
    return (
      <div className="bg-gradient-to-br from-gray-950 to-black min-h-screen text-white py-12 px-4 md:px-10 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-500 text-center">User ID is missing. Please log in.</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate("/login", { state: { returnUrl: location.pathname } })}
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }


  if (loading) return <div className="text-center"><p>Loading...</p></div>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="bg-gradient-to-br from-gray-950 to-black min-h-screen text-white py-12 px-4 md:px-10 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-6 text-center">Cart Summary</h1>

        {cart && cart.items.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div>
            {cart?.items.map((item, idx) => (
              <div key={`o-${idx}`} className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-6 mb-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center space-x-6">
                <div className="flex flex-col space-y-2">
                    {/* Showtime Info */}
                    <h2 className="text-xl font-semibold text-white">{item.showtimeDetails}</h2>
                    <p className="text-base font-semibold">Quantity: {item.quantity}</p>
                    <p className="text-lg font-bold">Total: ${item.totalPrice.toFixed(2)}</p>
                  </div>

                  <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 ml-auto">
                    <FaTrashAlt className="w-6 h-6" /> Remove
                  </button>
                </div>

                {/* Food Items Section */}
                {/* <div className="mt-4 bg-gray-800 rounded-xl p-4">
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
             */}
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
                onClick={() => navigate("/checkout", { state: { userId } })}
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
