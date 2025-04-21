import React from "react";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import foodData from "../constants/food.json";

// Define the structure of food data
interface FoodProps {
  title: string;
  image: string;
  description: string;
}

const { width: screenWidth } = Dimensions.get("window");

const FoodCard: React.FC = () => {
  const item: FoodProps = foodData[0];

  return (
    <View>
      <View>
        <Image
          source={{ uri: item.image }}
          style={styles.foodImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  foodImage: {
    width: "98%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
});

export default FoodCard;
