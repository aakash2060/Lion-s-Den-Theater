import React, { useState } from "react"; 
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

interface FoodProps {
  id: number;
  name: string;
  imgUrl: string;
  price: string;
  description: string;
  stockQuantity: string;
}

interface FoodMenuProps {
  foodItems: FoodProps[];
  onAddToCart: (item: FoodProps) => void;
}

const FoodMenu: React.FC<FoodMenuProps> = ({ foodItems, onAddToCart }) => {
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 48) / 2; 

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleQuantityChange = (id: number, change: number) => {
    setQuantities((prev) => {
      const newQuantity = (prev[id] || 0) + change;
      return {
        ...prev,
        [id]: newQuantity >= 0 ? newQuantity : 0,
      };
    });
    
    // Find the item and call onAddToCart when incrementing
    if (change > 0) {
      const item = foodItems.find(food => food.id === id);
      if (item) {
        onAddToCart(item);
      }
    }
  };

  const renderFoodItem = ({ item }: { item: FoodProps }) => {
    const isFavorite = favorites[item.id] || false;
    const quantity = quantities[item.id] || 0;

    return (
      <View style={{ width: cardWidth, alignItems: "center", marginBottom: 12 }}>
        {/* Image + Favorite Icon */}
        <View className="relative">
          <Image
            source={{ uri: item.imgUrl }}
            style={{
              width: cardWidth,
              height: cardWidth * 0.75,
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute top-2 right-2"
            onPress={() => toggleFavorite(item.id)}
          >
            <Icon name={isFavorite ? "heart" : "hearto"} size={20} color="#FF5F5F" />
          </TouchableOpacity>
        </View>

        {/* Food Info */}
        <View className="w-full px-2">
          <Text className="text-base font-semibold text-white mt-2">{item.name}</Text>
          <Text className="text-sm text-gray-400">${item.price}</Text>

          {/* Quantity Selector */}
          {quantity === 0 ? (
            <TouchableOpacity
              onPress={() => handleQuantityChange(item.id, 1)}
              style={{
                backgroundColor: "#E50914",
                padding: 8,
                borderRadius: 6,
                marginTop: 8,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Add to Cart</Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row items-center justify-between mt-3 bg-gray-800 rounded-lg p-1">
              <TouchableOpacity
                onPress={() => handleQuantityChange(item.id, -1)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>-</Text>
              </TouchableOpacity>

              <Text style={{ color: "white", fontSize: 16 }}>{quantity}</Text>

              <TouchableOpacity
                onPress={() => handleQuantityChange(item.id, 1)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={foodItems}
      renderItem={renderFoodItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{ paddingTop: 16 }}
    />
  );
};

export default FoodMenu;