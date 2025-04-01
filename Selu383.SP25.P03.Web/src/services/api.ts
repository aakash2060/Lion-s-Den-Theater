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

// ------------------------
// Interfaces
// ------------------------
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

export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: string;
  posterUrl: string;
  releaseDate: string;
  duration: number;
  description: string;
  director: string;
}

// ------------------------
// Movie Service Interface
// ------------------------
interface MovieService {
  getAll: (theater?: string | Theater) => Promise<Movie[]>;
  getById: (id: number) => Promise<Movie>;
  create: (movie: any) => Promise<Movie>;
  update: (id: number, movie: any) => Promise<Movie>;
  delete: (id: number) => Promise<any>;
}

// ✅ Movie Service Implementation
export const movieService: MovieService = {
  getAll: async (theater) => {
    let theaterId: string | undefined;

    if (typeof theater === "string") {
      theaterId = theater;
    } else if (typeof theater === "object" && theater?.id) {
      theaterId = theater.id.toString();
    }

    const url = theaterId ? `/movies?theater=${encodeURIComponent(theaterId)}` : "/movies";
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  create: async (movie) => {
    const response = await api.post('/movies', movie);
    return response.data;
  },

  update: async (id, movie) => {
    const response = await api.put(`/movies/${id}`, movie);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
  }
};

// ------------------------
// Theater Service
// ------------------------
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

export default api;
