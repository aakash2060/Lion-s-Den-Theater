import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";

interface MovieProps {
    onPress: ()=> void
    Title: string;
    Description?: string;
    Director?: string;
    Rating?: string;
    PosterUrl: string;
    ReleaseDate?: string;
    Genre?: string;
    trailerId?:string
}

const MovieCard: React.FC<MovieProps> = ({ Title, PosterUrl, ReleaseDate, onPress }) => {
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = (screenWidth - 48) / 2;
    
    
    return (
        <TouchableOpacity 
            onPress={onPress}
            className="mb-4 rounded-lg overflow-hidden"
            style={{ width: cardWidth }}
            activeOpacity={0.8}
        >
            <View className="bg-gray-800"> {/* Added background for better contrast */}
                <Image 
                    source={{ uri: PosterUrl }} 
                    style={{
                        width: cardWidth,
                        height: cardWidth * 1.5,
                        borderRadius: 8
                    }}
                    resizeMode="cover" 
                />
                
            </View>
        </TouchableOpacity>
    );
};

export default MovieCard;