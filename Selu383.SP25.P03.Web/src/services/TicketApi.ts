import axios from "axios";

// Define interfaces
interface PurchaseTicketRequest {
  showtimeId: number;
  seatNumber: string;
  ticketType: string;
  email?: string;
}

interface Ticket {
  id: number;
  showtimeId: number;
  userId: number;
  purchaseDate: string;
  seatNumber: string;
  price: number;
  isCheckedIn: boolean;
  ticketType: string;
  confirmationNumber: string;
  movieTitle?: string;
  theaterName?: string;
  hallNumber?: number;
  showtimeStart?: string;
}

// Create the ticket service
const ticketService = {
  // Get all tickets for the current user
  getUserTickets: async () => {
    const response = await axios.get("/api/tickets/user");
    return response.data;
  },

  // Get a specific ticket by ID
  getById: async (id: number) => {
    const response = await axios.get(`/api/tickets/${id}`);
    return response.data;
  },

  // Get all tickets for a specific showtime
  getByShowtime: async (showtimeId: number) => {
    const response = await axios.get(`/api/tickets/showtime/${showtimeId}`);
    return response.data;
  },

  // Purchase a ticket
  purchaseTicket: async (request: PurchaseTicketRequest): Promise<Ticket> => {
    const response = await axios.post("/api/tickets", request);
    return response.data;
  },

  // Cancel a ticket
  cancelTicket: async (id: number) => {
    const response = await axios.delete(`/api/tickets/${id}`);
    return response.data;
  },
};

export { ticketService };
export type { Ticket, PurchaseTicketRequest };