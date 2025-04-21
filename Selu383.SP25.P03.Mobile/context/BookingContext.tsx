// contexts/BookingContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type FoodItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type ShowtimeDto = {
  id: number;
  movieId: number;
  theaterId: number;
  startTime: string;
  endTime: string;
  price: number;
  is3D: boolean;
  hallNumber: number;
};

type Movie = {
  id: number;
  title: string;
  description: string;
  director: string;

};

type BookingContextType = {
  selectedSeats: string[];
  setSelectedSeats: (seats: string[]) => void;
  foodItems: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, 'quantity'>) => void;
  removeFoodItem: (id: string) => void;
  updateFoodItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  currentShowtime: ShowtimeDto | null;
  setCurrentShowtime: (showtime: ShowtimeDto) => void;
  currentMovie: Movie | null;
  setCurrentMovie: (movie: Movie) => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [currentShowtime, setCurrentShowtime] = useState<ShowtimeDto | null>(null);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const addFoodItem = (item: Omit<FoodItem, 'quantity'>) => {
    setFoodItems(prev => {
      const existingItem = prev.find(food => food.id === item.id);
      if (existingItem) {
        return prev.map(food =>
          food.id === item.id 
            ? { ...food, quantity: food.quantity + 1 } 
            : food
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFoodItem = (id: string) => {
    setFoodItems(prev => prev.filter(item => item.id !== id));
  };

  const updateFoodItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFoodItem(id);
      return;
    }
    setFoodItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setSelectedSeats([]);
    setFoodItems([]);
    setCurrentShowtime(null);
    setCurrentMovie(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedSeats,
        setSelectedSeats,
        foodItems,
        addFoodItem,
        removeFoodItem,
        updateFoodItemQuantity,
        clearCart,
        currentShowtime,
        setCurrentShowtime,
        currentMovie,
        setCurrentMovie,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};