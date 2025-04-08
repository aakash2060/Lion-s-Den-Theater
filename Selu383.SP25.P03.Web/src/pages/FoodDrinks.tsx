import { useEffect, useState } from "react";
import { fetchFoodMenus } from "../services/FoodApi";

const FoodMenuComponent = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // State to track cart items with their quantities, keyed by foodItem id.
  const [cart, setCart] = useState<{ [key: string]: number }>({});

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

  // Increase the quantity for the given food item.
  const handleIncrement = (id: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [id]: (prevCart[id] || 0) + 1,
    }));
  };

  // Decrease the quantity for the given food item, ensuring it doesn't go below 0.
  const handleDecrement = (id: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [id]: Math.max((prevCart[id] || 0) - 1, 0),
    }));
  };

  if (loading)
    return (
      <div className="text-center text-white text-xl py-20">Loading...</div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 text-xl py-20">{error}</div>
    );

  return (
    <div className="bg-black text-white min-h-screen py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-red-500">
        🍿 Food & Drinks Menu
      </h1>

      <div className="space-y-16">
        {menus.map((menu) => (
          <div key={menu.id}>
            <h2 className="text-3xl font-semibold mb-6 text-center bg-gradient-to-r from-red-600 to-purple-600 inline-block px-6 py-2 rounded-md shadow-md">
              {menu.name}
            </h2>

            {/* Food Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {menu.foodMenuItems.map((item: any) => (
                <div
                  key={item.foodItem.id}
                  className="flex flex-col items-center bg-gray-900 p-6 rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-red-500/50"
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

                  {/* Quantity control buttons */}
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <button
                      onClick={() => handleDecrement(item.foodItem.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      –
                    </button>
                    <span className="text-xl">
                      {cart[item.foodItem.id] || 0}
                    </span>
                    <button
                      onClick={() => handleIncrement(item.foodItem.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      +
                    </button>
                  </div>
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
