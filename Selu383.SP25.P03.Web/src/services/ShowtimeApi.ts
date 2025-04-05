import api from './api';
import { Showtime, ShowtimeDetail, CreateShowtime, UpdateShowtime } from '../Data/ShowtimeInterfaces';

export const showtimeService = {
  getAll: async (): Promise<Showtime[]> => {
    const response = await api.get('/showtimes');
    return response.data;
  },
  
  getById: async (id: number): Promise<ShowtimeDetail> => {
    const response = await api.get(`/showtimes/${id}`);
    return response.data;
  },
  
  getByMovieId: async (movieId: number): Promise<Showtime[]> => {
    const response = await api.get(`/showtimes/movie/${movieId}`);
    return response.data;
  },
  
  getUpcoming: async (): Promise<Showtime[]> => {
    const response = await api.get('/showtimes/upcoming');
    return response.data;
  },

  getByTheaterId: async (theaterId: number): Promise<Showtime[]> => {
    const response = await api.get(`/showtimes/theater/${theaterId}`);
    return response.data;
  },
  
  create: async (showtime: CreateShowtime) => {
    const response = await api.post('/showtimes', showtime);
    return response.data;
  },
  
  update: async (id: number, showtime: UpdateShowtime) => {
    const response = await api.put(`/showtimes/${id}`, showtime);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/showtimes/${id}`);
    return response.data;
  }
};