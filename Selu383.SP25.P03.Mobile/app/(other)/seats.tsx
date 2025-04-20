import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import SeatSelection from '@/components/seatSelection';
import { router } from 'expo-router';

export default function App() {
  const route = router
  return (
    <View className="flex-1">
      <SeatSelection 
        maxRows={12}
        bookedSeats={['A1', 'B2', 'C5', 'D3']}
        pricePerSeat={350}
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