import React from 'react';
import { View } from 'react-native';
import SeatSelection from '@/components/seatSelection';

export default function App() {
  return (
    <View className="flex-1">
      <SeatSelection 
        maxRows={12}
        bookedSeats={['A1', 'B2', 'C5', 'D3']}
        pricePerSeat={350}
      />
    </View>
  );
}