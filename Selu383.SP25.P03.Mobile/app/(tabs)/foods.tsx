import { SafeAreaView, ScrollView } from "react-native";
import { Text, View, TextInput } from "react-native";
import FoodMenu from "@/components/foodMenu";
import Icon from "react-native-vector-icons/AntDesign";
import { BASE_URL } from "@/constants/baseUrl";
import { useEffect, useState } from "react";
import axios from "axios";
import { useBooking } from "@/context/BookingContext";

interface FoodProps {
  id: number;
  name: string;
  imgUrl: string;
  price: string;
  description: string;
  stockQuantity: string;
}
export default function FoodsScreen() {
  const [foodItems, setFoodItems] = useState([]);
  
  const handleCart = (foodItem: FoodProps, quantity: number) => {
    const { addFoodItem, updateFoodItemQuantity } = useBooking();
  
    if (quantity === 1) {
      // Just increment
      addFoodItem({
        id: String(foodItem.id),
        name: foodItem.name,
        price: parseFloat(foodItem.price),
      });
    } else {
      // On decrement or manual adjustment
      updateFoodItemQuantity(String(foodItem.id), quantity);
    }
  };
  

  // Fetch the food items from backend
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/FoodItem`);
        setFoodItems(response.data);
      } catch (e) {
        console.error("Could not fetch food items", e);
      }
    };
    fetchFood();
  }, []);

  return (
    <SafeAreaView className="flex-1 px-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Title */}
        <Text className="text-2xl font-bold text-white text-center mt-5">
          Fast and Delicious Food
        </Text>

        {/* Search Bar */}
        <View className="bg-white rounded-xl mt-4 mb-6 px-4 py-3 shadow-md flex-row items-center">
          <Icon name="search1" size={20} color="#888" style={{ marginRight: 10 }} />
          <TextInput
            className="h-10 text-base text-gray-700 flex-1"
            placeholder="What are you craving?"
            placeholderTextColor="#888"
          />
        </View>

      
        {/* Scrollable Food Menu - Pass fetched data */}
        <FoodMenu foodItems={foodItems} onAddToCart={handleCart}/>
      </ScrollView>
    </SafeAreaView>
  );
}
