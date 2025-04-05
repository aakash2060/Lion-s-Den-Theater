
import axios from 'axios';


const api = axios.create({
  baseURL: '/api', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  }
});

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

// Add other API services as needed

export default api;