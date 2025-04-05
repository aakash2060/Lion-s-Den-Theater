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

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 48) / 2; 

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderFoodItem = ({ item }: { item: FoodProps }) => {
    const isFavorite = favorites[item.id] || false;

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
          
          {/* Add to Cart Button */}
          <TouchableOpacity
  className="flex-row items-center justify-center bg-['#E50914'] rounded-md py-3 px-6 mt-3"
  onPress={() => onAddToCart(item)}
  activeOpacity={0.85}
  style={{
   shadowColor:'#E50914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }}
>
  <Icon 
    name="shoppingcart"  
    size={16} 
    color="white" 
    style={{ marginRight: 10 }} 
  />
  <Text className="text-white font-bold text-sm tracking-wider">ADD TO CART</Text>
</TouchableOpacity>
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
      columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 8 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default FoodMenu;