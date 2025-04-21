import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import SeatSelection from '@/components/seatSelection';
import { router } from 'expo-router';
import { useBooking } from '@/context/BookingContext';
import { useLocalSearchParams } from 'expo-router';

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
export default function App() {
  const { selectedSeats, setSelectedSeats } = useBooking();
  const params = useLocalSearchParams();
  const showtime = JSON.parse(params.showtime as string) as ShowtimeDto;
  const movie = JSON.parse(params.movie as string) as Movie;

  const route = router
  return (
    <View className="flex-1">
      <SeatSelection 
        maxRows={12}
        bookedSeats={['A1', 'B2', 'C5', 'D3']}
        pricePerSeat={showtime.price}
        onSeatsSelected={setSelectedSeats}
      />
      <View className='mb-10  items-center pb-8'>
       <TouchableOpacity 
                  className="bg-red-600 py-3 px-10 rounded-lg mt-20 items-center"
                  onPress={() => route.push('/(other)/checkout')}
                >
                  <Text className="text-white font-bold">Buy Tickets</Text>
                </TouchableOpacity>
    </View>
    </View>
  );
}