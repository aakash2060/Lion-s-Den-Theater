import axios from 'axios';
import { CartDto, AddCartItemDto, UpdateCartItemDto, AddFoodCartItemDto } from '../Data/CartInterfaces';

const api = axios.create({
  baseURL: '/api', // Replace with your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});


export const cartService = {
  // Fetch the cart for a specific user
  getCart: async (userId: number): Promise<CartDto> => {
    const response = await api.get(`/cart/${userId}`);
    return response.data;
  },

   // Add a showtime item to the cart
   addToCart: async (userId: number, addCartItemDto: AddCartItemDto): Promise<CartDto> => {
    const response = await api.post(`/cart/${userId}/add`, addCartItemDto);
    return response.data;
  },

  // Remove an item from the cart
    removeFromCart: async (userId: number, cartItemId: number): Promise<CartDto> => {
    const response = await api.delete(`/cart/${userId}/remove/${cartItemId}`);
    return response.data;
  },
  
  // Update an item quantity in the cart
  updateCartItemQuantity: async (userId: number, cartItemId: number, quantity: number): Promise<CartDto> => {
    const updateDto: UpdateCartItemDto = { quantity };
    const response = await api.put(`/cart/${userId}/update/${cartItemId}`, updateDto);
    return response.data;
  },
  // Add food item to the cart
    addFoodToCart: async (userId: number, addFoodCartItemDto: AddFoodCartItemDto): Promise<CartDto> => {
    const response = await api.post(`/cart/${userId}/addFood`, addFoodCartItemDto);
    return response.data;
  },
  // Remove food item from the cart
  removeFoodFromCart: async (userId: number, foodCartItemId: number): Promise<CartDto> => {
    const response = await api.delete(`/cart/${userId}/removeFood/${foodCartItemId}`);
    return response.data;
  },

  // Clear the entire cart
  clearCart: async (userId: number): Promise<void> => {
    await api.delete(`/cart/${userId}/clear`);
  }
};

