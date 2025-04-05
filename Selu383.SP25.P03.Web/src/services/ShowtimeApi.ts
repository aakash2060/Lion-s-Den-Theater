import api from './MovieApi';
import { Showtime, ShowtimeDetail } from '../Data/ShowtimeInterfaces';

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
  }
};