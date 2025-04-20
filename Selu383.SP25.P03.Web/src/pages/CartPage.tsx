import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  //const location = useLocation();
  const navigate = useNavigate();

  // Sample placeholder data
  const totalPrice = 25.99;
  const selectedSeats = ['A1', 'B2', 'C3'];
  const foodCart = {
    item1: { foodItem: { name: 'Popcorn', price: 5.99 }, quantity: 2 },
    item2: { foodItem: { name: 'Soda', price: 2.99 }, quantity: 1 },
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Cart</h1>

      {/* Display selected seats */}
      <h3 className="text-xl font-semibold">Selected Seats:</h3>
      <ul className="mb-4">
        {selectedSeats.length > 0 ? (
          selectedSeats.map((seat, index) => (
            <li key={index}>{seat}</li>
          ))
        ) : (
          <li>No seats selected</li>
        )}
      </ul>

      {/* Display food items */}
      <h3 className="text-xl font-semibold">Food Items:</h3>
      <ul className="mb-4">
        {Object.values(foodCart).length > 0 ? (
          Object.values(foodCart).map((item, index) => (
            <li key={index}>
              {item.foodItem.name} × {item.quantity} - ${(item.foodItem.price * item.quantity).toFixed(2)}
            </li>
          ))
        ) : (
          <li>No food items selected</li>
        )}
      </ul>

      {/* Display total price */}
      <h3 className="text-xl font-bold">Total Price: ${(totalPrice).toFixed(2)}</h3>

      {/* Proceed to payment */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/payment', { state: { totalPrice, selectedSeats, foodCart } })}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md font-semibold"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Cart;
