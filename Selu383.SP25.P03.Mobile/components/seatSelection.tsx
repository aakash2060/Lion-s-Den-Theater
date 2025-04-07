import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Dimensions } from 'react-native';


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
        <Text className="w-5 mr-2 font-bold">{row[0].row}</Text>
        
        {row.map((seat) => (
          <TouchableOpacity
            key={seat.id}
            className={`rounded-md justify-center items-center mr-1 ${
              seat.isBooked ? 'bg-red-200' : 
              seat.isSelected ? 'bg-green-300' : 'bg-gray-200'
            } ${seat.isAisle ? 'mr-5' : ''}`}
            style={{ width: seatSize, height: seatSize }}
            onPress={() => toggleSeat(seat.id)}
            disabled={seat.isBooked}
            activeOpacity={0.7}
          >
            <Text className={`font-medium`} style={{ fontSize: seatSize * 0.35 }}>
              {seat.number}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <View className="flex-1 bg-white">
      {/* Screen */}
      <View className="items-center my-5">
        <View className="w-4/5 h-4 bg-white-300 rounded-t-lg mb-1" />
        <Text className="text-xs text-blue">SCREEN THIS WAY</Text>
      </View>

      {/* Seats */}
      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 30 }}>
        {renderSeats()}
      </ScrollView>

      {/* Legend */}
      <View className="flex-row justify-center mb-4 gap-4">
        <View className="flex-row items-center gap-1">
          <View className="w-4 h-4 rounded bg-white-200" />
          <Text>Available</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <View className="w-4 h-4 rounded bg-red-200" />
          <Text>Booked</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <View className="w-4 h-4 rounded bg-green-300" />
          <Text>Selected</Text>
        </View>
      </View>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <View className="p-4 bg-gray-50 border-t border-gray-200">
          <Text className="text-base font-medium mb-1">
            Selected {selectedSeats.length} seat(s): {selectedSeats.join(', ')}
          </Text>
          <Text className="text-base font-medium">
            Total: ${selectedSeats.length * pricePerSeat}
          </Text>
        </View>
      )}
    </View>
  );
};

export default SeatSelection;