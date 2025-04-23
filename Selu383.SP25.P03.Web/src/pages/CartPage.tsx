import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartList, setCartList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [showGuestEmailInput, setShowGuestEmailInput] = useState(false);
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState("");

  const isValidPassword = (pwd: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(pwd);
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("orderCart") || "[]");
    setCartList(cartData);
  }, []);

  const getItemTotal = (item: any) => {
    const ticketTotal = item.showtime?.price * item.selectedSeats.length || 0;
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

  const handleCheckout = async () => {
    setError("");

    if (!isAuthenticated) {
      if (!guestEmail || !guestPassword) {
        setShowGuestEmailInput(true);
        setError("Email and password are required.");
        return;
      }

      if (!isValidEmail(guestEmail)) {
        setError("Please enter a valid email address.");
        return;
      }

      if (!isValidPassword(guestPassword)) {
        setError("Password must be at least 8 characters, include an uppercase letter, a number, and a special character.");
        return;
      }
    }

    try {
      setLoading(true);

      for (const order of cartList) {
        const { showtime, selectedSeats } = order;

        for (const seat of selectedSeats) {
          const res = await fetch("/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              showtimeId: showtime.id,
              seatNumber: seat,
              ticketType: "Standard",
              email: isAuthenticated ? undefined : guestEmail,
              password: isAuthenticated ? undefined : guestPassword,
            }),
          });

          if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(`Failed to book seat ${seat}: ${errorMsg}`);
          }
        }
      }

      const services: any[] = [];

      for (const order of cartList) {
        const { showtime, selectedSeats, foodCart } = order;

        for (const seat of selectedSeats) {
          services.push({
            name: `${showtime.movieTitle} - Seat ${seat}`,
            price: Math.round(showtime.price * 100)
          });
        }

        Object.values(foodCart || {}).forEach((foodItem: any) => {
          services.push({
            name: foodItem.foodItem.name,
            price: Math.round(foodItem.foodItem.price * foodItem.quantity * 100),
          });
        });
      }

      if (services.length === 0) {
        localStorage.removeItem("orderCart");
        alert("Tickets booked successfully!");
        navigate("/confirmation");
        return;
      }

      const { publicKey } = await fetch("/api/payments/public-key").then((res) => res.json());
      const stripe = await loadStripe(publicKey);

      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services }),
      });

      const { sessionId } = await response.json();
      if (!sessionId) throw new Error("Stripe session not created");

      localStorage.removeItem("orderCart");
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error: any) {
      alert(error.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-950 to-black min-h-screen text-white py-12 px-4 md:px-10 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-6 text-center">Your Cart</h1>

        {cartList.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div>
            {cartList.map((order, idx) => (
              <div key={`order-${idx}`} className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-6 mb-6">
                {order.showtime && (
                  <div className="flex items-center space-x-6">
                    <img
                      src={order.showtime.moviePoster}
                      alt={order.showtime.movieTitle}
                      className="w-32 h-48 rounded-lg shadow-md"
                    />
                    <div className="flex flex-col space-y-2">
                      <h2 className="text-xl font-semibold text-white">{order.showtime.movieTitle}</h2>
                      <p className="text-sm text-gray-400">
                        {new Date(order.showtime.startTime).toLocaleDateString()} - {" "}
                        {new Date(order.showtime.startTime).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-gray-400">Seats: {order.selectedSeats.join(", ")}</p>
                      <p className="text-base font-semibold">
                        Price: ${order.showtime.price.toFixed(2)} per ticket
                      </p>
                      <p className="text-lg font-bold">
                        Ticket Total: ${(order.showtime.price * order.selectedSeats.length).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {order.foodCart && Object.keys(order.foodCart).length > 0 && (
                  <div className="bg-gray-800 rounded-xl p-4">
                    <h3 className="text-xl font-semibold mb-4">Food & Drinks</h3>
                    {Object.values(order.foodCart).map((foodItem: any, index: number) => (
                      <div key={`food-${index}`} className="flex items-center justify-between gap-4 py-3 border-b border-gray-700">
                        <div className="flex items-center gap-4">
                          <img
                            src={foodItem.foodItem.imgUrl || "/api/placeholder/100/100"}
                            alt={foodItem.foodItem.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <span className="text-sm text-white">{foodItem.foodItem.name} × {foodItem.quantity}</span>
                        </div>
                        <span className="text-sm text-white">
                          ${(foodItem.foodItem.price * foodItem.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => removeItem(idx)}
                    className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-semibold mt-4"
                  >
                    <FaTrashAlt className="inline mr-2" /> Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-gray-800 rounded-xl p-4 shadow-lg mt-8">
              <div className="flex justify-between font-bold text-xl">
                <span>Total Cart Value:</span>
                <span className="text-lg">${getCartTotal().toFixed(2)}</span>
              </div>

              {!isAuthenticated && showGuestEmailInput && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Guest Email</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="guest@example.com"
                      className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Create Password</label>
                    <input
                      type="password"
                      value={guestPassword}
                      onChange={(e) => setGuestPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm pt-1">{error}</p>}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`bg-green-600 text-white hover:bg-green-700 px-8 py-4 rounded-lg font-semibold transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Processing..." : "Complete Booking"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;