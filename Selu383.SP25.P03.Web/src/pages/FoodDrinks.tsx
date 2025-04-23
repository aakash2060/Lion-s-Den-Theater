import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFoodMenus } from "../services/FoodApi";
import { cartService } from "../services/CartApi";
import { AddFoodCartItemDto } from "../Data/CartInterfaces";
import { useAuth } from "../context/AuthContext";

const FoodMenuComponent = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [addingItems, setAddingItems] = useState<{[key: string]: boolean}>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State to track cart items with their quantities, keyed by foodItem id.

  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const getFoodMenus = async () => {
      try {
        const data = await fetchFoodMenus();
        setMenus(data);
      } catch (err) {
        setError("Failed to fetch food menus");
      } finally {
        setLoading(false);
      }
    };
    getFoodMenus();
  }, []);

  const handleIncrement = (id: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [id]: (prevCart[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: string) => {
    setCart((prevCart) => {
      const newValue = Math.max((prevCart[id] || 0) - 1, 0);
      if (newValue === 0) {
        // Remove the item from cart if quantity is 0
        const { [id]: _, ...rest } = prevCart;
        return rest;
      }
      return { ...prevCart, [id]: newValue };
    });
  };

  // Add item to cart
  const handleAddToCart = async (foodItemId: string, quantity: number, name: string) => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { returnUrl: location.pathname } });
      return;
    }
    
    try {
      setAddingItems(prev => ({...prev, [foodItemId]: true}));
      
      const foodCartItem: AddFoodCartItemDto = {
        foodItemId: parseInt(foodItemId),
        quantity
      };
      
      await cartService.addFoodToCart(user.id, foodCartItem);
      
      // Clear the item from local cart
      setCart(prev => {
        const newCart = {...prev};
        delete newCart[foodItemId];
        return newCart;
      });
      
      setSuccessMessage(`Added ${name} to cart!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setError("Failed to add item to cart.");
    } finally {
      setAddingItems(prev => ({...prev, [foodItemId]: false}));
    }
  };

  // Navigate to cart
  const handleViewCart = () => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { returnUrl: "/cart" } });
      return;
    }
    navigate(`/cart?userId=${user.id}`);
  };

  const handleAddFoodToCart = (item: any, quantity: number) => {
    if (quantity <= 0) return;

    const cartData = JSON.parse(localStorage.getItem("orderCart") || "[]");

    const foodEntry = {
      showtime: null,
      selectedSeats: [],
      foodCart: {
        [item.id]: {
          foodItem: item,
          quantity: quantity,
        },
      },
    };

    cartData.push(foodEntry);
    localStorage.setItem("orderCart", JSON.stringify(cartData));
    setToast(`${item.name} added to cart!`);
    setTimeout(() => setToast(null), 3000);
  };

  if (loading)
    return (
      <div className="text-center text-white text-xl py-20">Loading...</div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 text-xl py-20">{error}</div>
    );

  // Get count of items in cart
  const cartItemsCount = Object.values(cart).reduce((acc, qty) => acc + qty, 0);

  return (

    <div className="bg-black text-white min-h-screen py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-red-400">

        🍿 Food & Drinks Menu
      </h1>

      {/* Cart icon with counter */}
      <div className="fixed top-24 right-6 z-50">
        <button 
          onClick={handleViewCart}
          className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full shadow-lg flex items-center justify-center relative"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-lg mb-6 text-center z-50 shadow-lg">
          {successMessage}
        </div>
      )}

      <div className="space-y-16">
        {menus.map((menu) => (
          <div key={menu.id}>
            <h2 className="text-3xl font-semibold mb-6 text-center bg-gradient-to-r from-red-600 to-purple-600 inline-block px-6 py-2 rounded-md shadow-md">
              {menu.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {menu.foodMenuItems.map((item: any) => (
                <div
                  key={item.foodItem.id}
                  className="flex flex-col items-center bg-gray-900 p-6 rounded-xl shadow-lg transition-all hover:shadow-red-500/50"
                >
                  <img
                    src={item.foodItem.imgUrl || "/api/placeholder/400/300"}
                    alt={item.foodItem.name}
                    className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-700"
                  />
                  <h3 className="text-2xl font-semibold text-white text-center">
                    {item.foodItem.name}
                  </h3>
                  <p className="text-gray-400 text-sm text-center">
                    {item.foodItem.description}
                  </p>
                  <p className="text-lg font-bold text-red-400 mt-2">
                    ${item.foodItem.price}
                  </p>


                  {!cart[item.foodItem.id] ? (
                    // Add to cart button when no items selected

                    <button
                      onClick={() => handleIncrement(item.foodItem.id)}
                      className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold w-full"
                    >
                      Add to Cart
                    </button>

                  ) : (
                    // Quantity controls with add to cart when items selected
                    <div className="mt-4 w-full">
                      <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2">
                        <button
                          onClick={() => handleDecrement(item.foodItem.id)}
                          className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full"
                          disabled={addingItems[item.foodItem.id]}
                        >
                          -
                        </button>
                        <span className="text-lg font-semibold">
                          {cart[item.foodItem.id]}
                        </span>
                        <button
                          onClick={() => handleIncrement(item.foodItem.id)}
                          className="w-8 h-8 flex items-center justify-center bg-emerald-600 hover:bg-green-600 text-white rounded-full"
                          disabled={addingItems[item.foodItem.id]}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleAddToCart(
                          item.foodItem.id, 
                          cart[item.foodItem.id], 
                          item.foodItem.name
                        )}
                        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold w-full flex items-center justify-center"
                        disabled={addingItems[item.foodItem.id]}
                      >
                        {addingItems[item.foodItem.id] ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding...
                          </span>
                        ) : (
                          'Add to Cart'
                        )}
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodMenuComponent;