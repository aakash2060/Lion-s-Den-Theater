// src/services/api.ts
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api', // This will use the relative path
  withCredentials: true, // Important for auth cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Example API functions for movies
export const movieService = {
  getAll: async () => {
    const response = await api.get('/movies');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  create: async (movie: any) => {
    const response = await api.post('/movies', movie);
    return response.data;
  },

  update: async (id: number, movie: any) => {
    const response = await api.put(`/movies/${id}`, movie);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
  }
};

// API functions for theaters
export const theaterService = {
  getAll: async () => {
    const response = await api.get("/theaters");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/theaters/${id}`);
    return response.data;
  },

  create: async (theater: TheaterDto) => {
    const response = await api.post("/theaters", theater);
    return response.data;
  },

  update: async (id: number, theater: TheaterDto) => {
    const response = await api.put(`/theaters/${id}`, theater);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/theaters/${id}`);
    return response.data;
  },
};

export interface Theater {
  id: number;
  name: string;
  address: string;
  seatCount: number;
  managerId: number | null;
}

export interface TheaterDto {
  id?: number;
  name: string;
  address: string;
  seatCount: number;
  managerId?: number | null;
}

export default api;
