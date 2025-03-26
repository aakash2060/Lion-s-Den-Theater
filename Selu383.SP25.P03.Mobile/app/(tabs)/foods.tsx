import { SafeAreaView, ScrollView } from "react-native";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import FoodMenu from "@/components/foodMenu";
import FoodCard from "@/components/foodcard";
import Icon from "react-native-vector-icons/AntDesign";

export default function FoodsScreen() {
  return (
    <SafeAreaView className="flex-1 px-4 ">
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Title */}
        <Text className="text-2xl font-bold text-white text-center mt-5">
          Fast and Delicious Food
        </Text>

        {/* Search Bar with Icon */}
        <View className="bg-white rounded-xl mt-4 mb-6 px-4 py-3 shadow-md flex-row items-center">
          <Icon name="search1" size={20} color="#888" style={{ marginRight: 10 }} />
          <TextInput
            className="h-10 text-base text-gray-700 flex-1"
            placeholder="What are you craving?"
            placeholderTextColor="#888"
          />
        </View>

        {/* Food Card */}
        <View className="mb-6">
          <FoodCard />
        </View>

        {/* Scrollable Food Menu */}
        <FoodMenu />
      </ScrollView>
    </SafeAreaView>
  );
}
