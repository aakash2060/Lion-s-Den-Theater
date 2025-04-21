import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import { cartService } from "../services/CartApi";
import { CartDto, CartItemDto, FoodCartItemDto } from "../Data/CartInterfaces";
import { useAuth } from "../context/AuthContext";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [itemsLoading, setItemsLoading] = useState<{[key: string]: boolean}>({});
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const userIdFromQuery = searchParams.get('userId');
  const userId = userIdFromQuery ? parseInt(userIdFromQuery) : (user ? user.id : null);

  useEffect(() => {
    if (!isAuthenticated && !userIdFromQuery) {
      navigate('/login', { state: { returnUrl: location.pathname } });
    }
  }, [isAuthenticated, navigate, location.pathname, userIdFromQuery]);

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
      console.error("Error fetching cart:", err);
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const getItemTotal = (item: CartItemDto) => item.totalPrice;

  const getFoodItemsTotal = () => {
    return cart?.foodItems?.reduce((acc: number, item: FoodCartItemDto) => acc + item.totalPrice, 0) || 0;
  };

  const getTicketsTotal = () => {
    return cart?.items.reduce((acc: number, item: CartItemDto) => acc + getItemTotal(item), 0) || 0;
  };

  const getCartTotal = () => {
    return getTicketsTotal() + getFoodItemsTotal();
  };

  const handleRemoveItem = async (cartItemId: number) => {
    if (!userId) {
      setError("User ID is missing. Please log in.");
      return;
    }

    try {
      const newLoadingState = {...itemsLoading};
      newLoadingState[`ticket-${cartItemId}`] = true;
      setItemsLoading(newLoadingState);
      
      const updatedCart = await cartService.removeFromCart(userId, cartItemId);
      setCart(updatedCart);
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item from cart.");
    } finally {
      const newLoadingState = {...itemsLoading};
      newLoadingState[`ticket-${cartItemId}`] = false;
      setItemsLoading(newLoadingState);
    }
  };

  const handleRemoveFoodItem = async (foodCartItemId: number) => {
    if (!userId) {
      setError("User ID is missing. Please log in.");
      return;
    }

    try {
      const newLoadingState = {...itemsLoading};
      newLoadingState[`food-${foodCartItemId}`] = true;
      setItemsLoading(newLoadingState);
      
      const updatedCart = await cartService.removeFoodFromCart(userId, foodCartItemId);
      setCart(updatedCart);
    } catch (err) {
      console.error("Error removing food item:", err);
      setError("Failed to remove food item from cart.");
    } finally {
      const newLoadingState = {...itemsLoading};
      newLoadingState[`food-${foodCartItemId}`] = false;
      setItemsLoading(newLoadingState);
    }
  };

  const handleUpdateCartItemQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    if (!userId) {
      setError("User ID is missing. Please log in.");
      return;
    }

    try {
      const newLoadingState = {...itemsLoading};
      newLoadingState[`ticket-${cartItemId}`] = true;
      setItemsLoading(newLoadingState);
      
      const updatedCart = await cartService.updateCartItemQuantity(userId, cartItemId, newQuantity);
      setCart(updatedCart);
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update item quantity.");
    } finally {
      const newLoadingState = {...itemsLoading};
      newLoadingState[`ticket-${cartItemId}`] = false;
      setItemsLoading(newLoadingState);
    }
  };

  const handleClearCart = async () => {
    if (!userId) {
      setError("User ID is missing. Please log in.");
      return;
    }

    try {
      setLoading(true);
      await cartService.clearCart(userId);
      setCart({
        id: cart?.id || 0,
        userId: userId,
        items: [],
        foodItems: []
      });
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Failed to clear cart.");
    } finally {
      setLoading(false);
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

  if (loading) return <div className="text-center text-white py-12"><p>Loading your cart...</p></div>;
  if (error) return <p className="text-red-500 text-center py-12">{error}</p>;

  return (
    <div className="bg-gradient-to-br from-gray-950 to-black min-h-screen text-white py-12 px-4 md:px-10 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-6 text-center">Cart Summary</h1>

        {(!cart || (cart.items.length === 0 && (cart.foodItems || []).length === 0)) ? (
          <div className="text-center py-10 bg-gray-900 rounded-xl">
            <p className="text-gray-500 text-xl mb-4">Your cart is empty.</p>
            <button 
              onClick={() => navigate("/home")} 
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            {/* Ticket Items */}
            {cart.items && cart.items.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">Tickets</h2>
                {cart.items.map((item, idx) => (
                  <div key={`ticket-${idx}`} className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-2 mb-6 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white">{item.showtimeDetails}</h3>
                        <div className="flex items-center mt-2">
                          <button 
                            onClick={() => handleUpdateCartItemQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-lg"
                            disabled={itemsLoading[`ticket-${item.id}`]}
                          >
                            <FaMinus className="w-4 h-4" />
                          </button>
                          <span className="mx-3 min-w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateCartItemQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-lg"
                            disabled={itemsLoading[`ticket-${item.id}`]}
                          >
                            <FaPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${item.totalPrice.toFixed(2)}</p>
                        <button 
                          onClick={() => handleRemoveItem(item.id)} 
                          className="text-red-500 hover:text-red-700 mt-2 flex items-center gap-1"
                          disabled={itemsLoading[`ticket-${item.id}`]}
                        >
                          {itemsLoading[`ticket-${item.id}`] ? 'Removing...' : (
                            <>
                              <FaTrashAlt className="w-4 h-4" /> Remove
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Food Items */}
            {cart.foodItems && cart.foodItems.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">Food & Drinks</h2>
                {cart.foodItems.map((item, idx) => (
                  <div key={`food-${idx}`} className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-2 mb-6 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center space-x-4">
                      {item.foodImageUrl && (
                        <img src={item.foodImageUrl} alt={item.foodName} className="w-16 h-16 object-cover rounded-lg" />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.foodName}</h3>
                        <p className="text-sm text-gray-400">{item.foodDescription}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm">${item.unitPrice.toFixed(2)} × {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${item.totalPrice.toFixed(2)}</p>
                        <button 
                          onClick={() => handleRemoveFoodItem(item.id)} 
                          className="text-red-500 hover:text-red-700 mt-2 flex items-center gap-1"
                          disabled={itemsLoading[`food-${item.id}`]}
                        >
                          {itemsLoading[`food-${item.id}`] ? 'Removing...' : (
                            <>
                              <FaTrashAlt className="w-4 h-4" /> Remove
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cart Total */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-8">
              <div className="space-y-2 border-b border-gray-700 pb-4 mb-4">
                <div className="flex justify-between">
                  <span>Tickets Subtotal:</span>
                  <span>${getTicketsTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Food & Drinks:</span>
                  <span>${getFoodItemsTotal().toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-between mt-4 gap-4">
              <button
                onClick={handleClearCart}
                className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
                disabled={loading}
              >
                {loading ? 'Clearing...' : 'Clear Cart'}
              </button>
              <button
                onClick={() => navigate("/checkout", { state: { userId } })}
                className="bg-green-600 text-white hover:bg-green-700 px-8 py-3 rounded-lg font-semibold"
                disabled={loading}
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