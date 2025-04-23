import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '@/context/BookingContext';
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';
import { BASE_URL } from "@/constants/baseUrl";

export default function CartScreen() {
  const router = useRouter();
  const {
    selectedSeats,
    foodItems,
    removeFoodItem,
    updateFoodItemQuantity,
    clearCart,
    currentShowtime,
    currentMovie
  } = useBooking();

  const ticketPrice = currentShowtime?.price || 0; 
  const seatTotal = selectedSeats.length * ticketPrice;
  const foodTotal = foodItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = seatTotal + foodTotal;

  const handleCheckout = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert("No seats selected", "Please select at least one seat before checkout.");
      return;
    }
  
    try {
      // 1. Request a payment intent from backend
      const response = await fetch(`${BASE_URL}/api/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });
      
      
  
      const { clientSecret } = await response.json();
  
      if (!clientSecret) {
        Alert.alert("Error", "Failed to get payment client secret.");
        return;
      }
  
      // 2. Initialize Stripe payment sheet
      const initSheet = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Lion's Den Theater",
      });
      
      
  
      if (initSheet.error) {
        Alert.alert("Error", initSheet.error.message);
        return;
      }
  
      // 3. Show Stripe payment sheet
      const paymentResult = await presentPaymentSheet();
  
      if (paymentResult.error) {
        Alert.alert("Payment failed", paymentResult.error.message);
      } else {
        Alert.alert("Success", "Payment complete!");
        clearCart(); // optionally clear cart
        router.push('/'); // or wherever you want to go after payment
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong with payment.");
    }
  };
  

  const navigateToFoodMenu = () => {
    router.push('/(tabs)/foods');
  };

  const navigateToSeats = () => {
    router.push('/');  
  }

  const incrementQuantity = (id: any) => {
    const item = foodItems.find(item => item.id === id);
    if (item) {
      updateFoodItemQuantity(id, item.quantity + 1);
    }
  };

  const decrementQuantity = (id: any) => {
    const item = foodItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateFoodItemQuantity(id, item.quantity - 1);
    } else if (item) {
      removeFoodItem(id);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black mt-10">
      <View className="flex-1 bg-black">
        <ScrollView className="flex-1">
          <View className="p-4">
            <Text className="text-2xl font-bold mb-6 text-white">Your Cart</Text>
            
            {/* Seats Section */}
            {selectedSeats.length > 0 ? (
              <View className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <Text className="text-lg font-semibold mb-2 text-white">Selected Seats</Text>
                {selectedSeats.map((seat, index) => (
                  <View key={index} className="flex-row justify-between py-3 border-b border-gray-700">
                    <Text className="text-white">Seat {seat}</Text>
                    <Text className="text-white">${ticketPrice.toFixed(2)}</Text>
                  </View>
                ))}
                <View className="flex-row justify-between pt-3 mt-2">
                  <Text className="font-semibold text-white">Seats Subtotal</Text>
                  <Text className="font-semibold text-white">${seatTotal.toFixed(2)}</Text>
                </View>
              </View>
            ) : (
              <View className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700 items-center">
                <Text className="text-lg text-gray-300">No seats selected</Text>
                <TouchableOpacity 
                  className="mt-3 bg-red-600 px-4 py-2 rounded-lg"
                  onPress={navigateToSeats}
                >
                  <Text className="text-white font-medium">Select Seats</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Food Items Section */}
            <View className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-semibold text-white">Food & Drinks</Text>
                <TouchableOpacity 
                  className="bg-red-600 px-3 py-1 rounded-lg"
                  onPress={navigateToFoodMenu}
                >
                  <Text className="text-white font-medium">Add Items</Text>
                </TouchableOpacity>
              </View>
              
              {foodItems.length > 0 ? (
                <>
                  {foodItems.map((item) => (
                    <View key={item.id} className="flex-row justify-between items-center py-3 border-b border-gray-700">
                      <View className="flex-1">
                        <Text className="font-medium text-white">{item.name}</Text>
                        <Text className="text-gray-300">${item.price.toFixed(2)} each</Text>
                      </View>
                      
                      <View className="flex-row items-center">
                        <TouchableOpacity 
                          className="bg-gray-700 w-8 h-8 rounded-full items-center justify-center"
                          onPress={() => decrementQuantity(item.id)}
                        >
                          <Text className="text-lg font-bold text-white">-</Text>
                        </TouchableOpacity>
                        
                        <Text className="mx-3 text-lg text-white">{item.quantity}</Text>
                        
                        <TouchableOpacity 
                          className="bg-gray-700 w-8 h-8 rounded-full items-center justify-center"
                          onPress={() => incrementQuantity(item.id)}
                        >
                          <Text className="text-lg font-bold text-white">+</Text>
                        </TouchableOpacity>
                      </View>
                      
                      <Text className="ml-4 font-medium text-white">${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  ))}
                  <View className="flex-row justify-between pt-3 mt-2">
                    <Text className="font-semibold text-white">Food Subtotal</Text>
                    <Text className="font-semibold text-white">${foodTotal.toFixed(2)}</Text>
                  </View>
                </>
              ) : (
                <View className="py-4 items-center">
                  <Text className="text-gray-300">No food items added</Text>
                </View>
              )}
            </View>
            
            {/* Order Summary */}
            <View className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
              <Text className="text-lg font-semibold mb-3 text-white">Order Summary</Text>
              
              <View className="flex-row justify-between py-2">
                <Text className="text-white">Seats ({selectedSeats.length})</Text>
                <Text className="text-white">${seatTotal.toFixed(2)}</Text>
              </View>
              
              <View className="flex-row justify-between py-2">
                <Text className="text-white">Food & Drinks</Text>
                <Text className="text-white">${foodTotal.toFixed(2)}</Text>
              </View>
              
              <View className="flex-row justify-between py-3 mt-2 border-t border-gray-700">
                <Text className="text-lg font-semibold text-white">Total</Text>
                <Text className="text-lg font-semibold text-white">${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        
        {/* Fixed Bottom Bar */}
        <View className="p-4 bg-gray-800 border-t border-gray-700">
          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-semibold text-white">Total:</Text>
            <Text className="text-lg font-bold text-white">${total.toFixed(2)}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-gray-700 px-6 py-3 rounded-lg flex-1 mr-2"
              onPress={() => {
                Alert.alert(
                  "Clear Cart",
                  "Are you sure you want to clear your cart?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Clear", onPress: clearCart, style: "destructive" }
                  ]
                );
              }}
            >
              <Text className="text-white font-semibold text-center">Clear Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-600 px-6 py-3 rounded-lg flex-1 ml-2"
              onPress={handleCheckout}
            >
              <Text className="text-white font-semibold text-center">Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}