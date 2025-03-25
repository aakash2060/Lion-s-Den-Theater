import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import foodData from "../constants/food.json";

interface FoodProps {
  title: string;
  image: string;
  price: string;
}

const FoodMenu = () => {
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 48) / 2; // Adjusted width for two columns with spacing

  const toggleFavorite = (title: string) => {
    setFavorites((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const renderFoodItem = ({ item }: { item: FoodProps }) => {
    const isFavorite = favorites[item.title] || false;

    return (
      <View style={{ width: cardWidth, alignItems: "center", marginBottom: 12 }}>
        {/* Image + Favorite Icon */}
        <View className="relative">
          <Image
            source={{ uri: item.image }}
            style={{
              width: cardWidth,
              height: cardWidth * 0.75,
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute top-2 right-2"
            onPress={() => toggleFavorite(item.title)}
          >
            <Icon name={isFavorite ? "heart" : "hearto"} size={20} color="#FF5F5F" />
          </TouchableOpacity>
        </View>

        <Text className="text-base font-semibold text-white mt-2">{item.title}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={foodData}
      renderItem={renderFoodItem}
      keyExtractor={(item) => item.title}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 8 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default FoodMenu;
