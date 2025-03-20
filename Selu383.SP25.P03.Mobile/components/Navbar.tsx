import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

const Navbar = () => {
    return (
        <View className="flex-row items-center bg-black p-4">
            {/* App Name - Increased text size */}
            <Text className="text-white text-10xl font-bold flex-1">Lion's Den</Text> {/* Increased from text-5xl to text-6xl */}
            
            {/* Icons - Moved to the right and increased size */}
            <View className="flex-row items-center space-x-7"> {/* Increased space between icons */}
        <TouchableOpacity>
                    <Icon name="user" size={30} color="white" /> {/* Increased icon size */}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Navbar;
