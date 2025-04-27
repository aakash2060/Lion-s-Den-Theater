import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import SeatSelection from '@/components/seatSelection';
import { router } from 'expo-router';
import { useBooking } from '@/context/BookingContext';
import { useLocalSearchParams } from 'expo-router';
import { BASE_URL } from '@/constants/baseUrl';

type ShowtimeDto = {
  id: number;
  movieId: number;
  theaterId: number;
  startTime: string;
  endTime: string;
  price: number;
  is3D: boolean;
  hallNumber: number;
};

type Movie = {
  type: string;
  id: number;
  title: string;
  description: string;
  director: string;

}
type Ticket = {
  id: number;
  seatNumber: string;
  showtimeId: number;
  movieTitle: string;
  showtime: string;
  theaterName: string;
  showtimeStart: string;
};

export default function App() {
  const[bookedSeats, setBookedSeats] = React.useState<string[]>([]);
  const { selectedSeats, setSelectedSeats } = useBooking();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const params = useLocalSearchParams();
  const showtime = JSON.parse(params.showtime as string) as ShowtimeDto;
  const movie = JSON.parse(params.movie as string) as Movie;
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/api/tickets/showtime/${showtime.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch booked seats: ${response.status}`);
        }

        const tickets: Ticket[] = await response.json();
        const bookedSeatNumbers = tickets.map(ticket => ticket.seatNumber);
        setBookedSeats(bookedSeatNumbers);
      } catch (err) {
        console.error('Error fetching booked seats:', err);
        setError('Failed to load seat availability. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSeats();
  }, [showtime.id]);

  const handleClick = ()=>{
    if(selectedSeats.length === 0){
      alert('Please select at least one seat!')
      return
    }
    router.push('/(other)/checkout')
  }

  const route = router
  return (
    <View className="flex-1">
      <SeatSelection 
        maxRows={12}
        bookedSeats={bookedSeats}
        pricePerSeat={showtime.price}
        onSeatsSelected={setSelectedSeats}
      />
      <View className='mb-10  items-center pb-8'>
       <TouchableOpacity 
                  className="bg-red-600 py-3 px-10 rounded-lg mt-20 items-center"
                  onPress={handleClick}
                >
                  <Text className="text-white font-bold">Buy Tickets</Text>
                </TouchableOpacity>
    </View>
    </View>
  );
}