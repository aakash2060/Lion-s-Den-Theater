import { Showtime } from "./ShowtimeInterfaces";

export interface Movie {
    id: number;
    title: string;
    description: string;
    director: string;
    duration: number;
    rating: string;
    genre: string;
    posterUrl: string;
    releaseDate: string; 
  }
  export interface MovieProps {
    id: number;
    title: string;
    posterUrl: string; 
    releaseDate: string;  
    genre: string;
    rating?: string;
  }

export interface MovieDetails extends Movie {
  showtimes?: Showtime[]; 
}


  