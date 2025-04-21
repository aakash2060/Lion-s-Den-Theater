// components/CartIcon.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useBooking } from '@/context/BookingContext'; 
import { Ionicons } from '@expo/vector-icons'; 

const CartIcon = ({ onPress }: { onPress: () => void }) => {
  const { foodItems } = useBooking();

  const totalQuantity = foodItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <TouchableOpacity onPress={onPress} style={{ position: 'relative', padding: 8 }}>
      <Ionicons name="cart-outline" size={28} color="white" />
      {totalQuantity > 0 && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            backgroundColor: 'red',
            borderRadius: 10,
            width: 15,
            height: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 12 }}>{totalQuantity}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartIcon;
