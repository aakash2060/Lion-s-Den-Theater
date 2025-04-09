import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Checkout() {
  return (
    <SafeAreaView className='flex-1 justify-center items-center bg-black'>
      <Text className='text-white text-xl font-bold mb-4'>
        Checkout Page
      </Text>
      <Text className='text-white text-center'>
        Wow, your cart is empty!
      </Text>
    </SafeAreaView>
  );
}

export default Checkout;
