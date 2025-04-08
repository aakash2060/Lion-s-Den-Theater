export interface Showtime {
  id: number;
  movieId: number;
  movieTitle: string;
  hallId: number;
  hallNumber: number;
  theaterId: number;
  theaterName: string;
  startTime: string;
  endTime: string;
  price: number;
  is3D: boolean;
  availableSeats: number;
}

export interface ShowtimeDetail extends Showtime {
  moviePoster: string;
  movieDuration: number;
  totalSeats: number;
  isSoldOut: boolean;
}

export interface CreateShowtime {
  movieId: number;
  hallId: number;
  startTime: string;
  ticketPrice: number;
  is3D: boolean;
}

export interface UpdateShowtime {
  startTime: string;
  ticketPrice: number;
  is3D: boolean;
}
