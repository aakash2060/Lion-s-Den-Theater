import axios from 'axios';
import { CartDto, AddCartItemDto } from '../Data/CartInterfaces';

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

  // Add an item to the cart
  addToCart: async (userId: number, addCartItemDto: AddCartItemDto): Promise<CartDto> => {
    const response = await api.post(`/cart/${userId}/add`, addCartItemDto);
    return response.data;
  },

  // Remove an item from the cart
  removeFromCart: async (userId: number, cartItemId: number): Promise<CartDto> => {
    const response = await api.delete(`/cart/${userId}/remove/${cartItemId}`);
    return response.data;
  },
};

