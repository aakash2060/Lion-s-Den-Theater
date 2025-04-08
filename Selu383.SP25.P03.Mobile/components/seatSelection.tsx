import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SeatProps = {
  maxRows?: number;
  maxCols?: number;
  bookedSeats?: string[];
  onSeatsSelected?: (seats: string[]) => void;
  pricePerSeat?: number;
};

type SeatType = {
  id: string;
  row: string;
  number: number;
  isBooked: boolean;
  isSelected: boolean;
  isAisle: boolean;
};

const SeatSelection: React.FC<SeatProps> = ({
  maxRows = 10,
  maxCols = 8,
  bookedSeats = ['A1', 'B5', 'C3'],
  onSeatsSelected = (seats) => console.log(seats),
  pricePerSeat = 250,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const { width } = Dimensions.get('window');
  const seatSize = width * 0.08;
  const seatGap = width * 0.02;
  const rowLabelGap = width * 0.03;

  const generateSeatLayout = (): SeatType[][] => {
    const rows: SeatType[][] = [];
    for (let row = 0; row < maxRows; row++) {
      const rowLetter = String.fromCharCode(65 + row);
      const cols: SeatType[] = [];
      
      for (let col = 1; col <= maxCols; col++) {
        const seatId = `${rowLetter}${col}`;
        cols.push({
          id: seatId,
          row: rowLetter,
          number: col,
          isBooked: bookedSeats.includes(seatId),
          isSelected: selectedSeats.includes(seatId),
          isAisle: col === Math.ceil(maxCols / 2),
        });
      }
      rows.push(cols);
    }
    return rows;
  };

  const toggleSeat = (seatId: string): void => {
    if (bookedSeats.includes(seatId)) return;
    
    setSelectedSeats(prev => {
      const newSelection = prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId];
      onSeatsSelected(newSelection);
      return newSelection;
    });
  };

  const renderSeats = (): JSX.Element[] => {
    return generateSeatLayout().map((row, rowIndex) => (
      <View 
        key={`row-${rowIndex}`} 
        className="flex-row items-center mb-3"
      >
        <Text className="font-bold text-white" style={{ width: rowLabelGap, marginRight: rowLabelGap }}>{row[0].row}</Text>
        
        {row.map((seat) => (
          <TouchableOpacity
            key={seat.id}
            className={`rounded-md justify-center items-center ${
              seat.isBooked 
                ? 'bg-yellow-600 border-yellow-700' 
                : seat.isSelected 
                  ? 'bg-red-600 border-red-700' 
                  : 'bg-gray-700 border-gray-600'
            }`}
            style={{ 
              width: seatSize, 
              height: seatSize,
              marginRight: seat.isAisle ? seatGap * 3 : seatGap,
              borderWidth: 1,
              opacity: seat.isBooked ? 0.6 : 1,
              transform: seat.isSelected ? [{ scale: 1.1 }] : []
            }}
            onPress={() => toggleSeat(seat.id)}
            disabled={seat.isBooked}
            activeOpacity={0.7}
          >
            <Text className={`font-medium ${seat.isBooked ? 'text-gray-300' : 'text-black'}`} 
              style={{ fontSize: seatSize * 0.35 }}>
              {seat.number}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
    <View>
      {/* Screen */}
      <View className="items-center my-5">
        <View className="w-4/5 h-6 bg-gray-800 rounded-t-lg mb-1 border border-gray-700" />
        <Text className="text-xs text-gray-400">SCREEN THIS WAY</Text>
      </View>

      {/* Seats */}
      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 30 }}>
        {renderSeats()}
      </ScrollView>

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24, paddingHorizontal: 24, backgroundColor: 'black' }}>
  {/* Available */}
  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24 }}>
    <View style={{
      width: 24,
      height: 24,
      backgroundColor: '#6B7280', // Tailwind gray-500
      borderColor: '#FFFFFF',
      borderWidth: 2
    }} />
    <Text style={{ color: '#FFFFFF', fontSize: 14, marginLeft: 8 }}>Available</Text>
  </View>

  {/* Booked */}
  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24 }}>
    <View style={{
      width: 24,
      height: 24,
      backgroundColor: '#000000',
      borderColor: '#FFFFFF',
      borderWidth: 2
    }} />
    <Text style={{ color: '#FFFFFF', fontSize: 14, marginLeft: 8 }}>Booked</Text>
  </View>

  {/* Selected */}
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <View style={{
      width: 24,
      height: 24,
      backgroundColor: '#DC2626', 
      borderColor: '#FFFFFF',
      borderWidth: 2
    }} />
    <Text style={{ color: '#FFFFFF', fontSize: 14, marginLeft: 8 }}>Selected</Text>
  </View>
</View>






      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <View className="p-4 bg-gray-900 border-t border-gray-800">
          <Text className="text-base font-medium mb-1 text-white">
            Selected {selectedSeats.length} seat(s): <Text className="text-amber-400">{selectedSeats.join(', ')}</Text>
          </Text>
          <Text className="text-base font-medium text-white">
            Total: <Text className="text-amber-400">${selectedSeats.length * pricePerSeat}</Text>
          </Text>
        </View>
      )}
    </View>
    </SafeAreaView>
  );
};

export default SeatSelection;