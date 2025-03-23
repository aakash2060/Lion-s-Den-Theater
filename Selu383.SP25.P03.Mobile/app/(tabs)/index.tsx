import React, { useState } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity } from "react-native";
import MovieCard from "../../components/MovieCard";
import movies from "../../constants/movies.json";

const Home = () => {
    const [activeTab, setActiveTab] = useState("NOW PLAYING");
    
    const nowShowing = movies.filter(movie => new Date(movie.release_date) <= new Date());
    const comingSoon = movies.filter(movie => new Date(movie.release_date) > new Date());
    
    return (
        <View className="bg-black flex-1">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Navigation Tabs */}
                <View className="flex-row justify-start px-5 mt-6">
                    <TouchableOpacity onPress={() => setActiveTab("NOW PLAYING")}>
                        <Text className={`${activeTab === "NOW PLAYING" ? "text-blue-400" : "text-gray-400"} text-lg font-bold mr-6`}>
                            NOW PLAYING
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab("COMING SOON")}>
                        <Text className={`${activeTab === "COMING SOON" ? "text-blue-400" : "text-gray-400"} text-lg font-bold mr-6`}>
                            COMING SOON
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab("ON DEMAND")}>
                        <Text className={`${activeTab === "ON DEMAND" ? "text-blue-400" : "text-gray-400"} text-lg font-bold`}>
                            ON DEMAND
                        </Text>
                    </TouchableOpacity>
                </View>
                
                {/* Now Playing Section - 2-column Grid */}
                {activeTab === "NOW PLAYING" && (
                    <FlatList
                        data={nowShowing}
                        keyExtractor={(item) => item.name}
                        numColumns={2}
                        scrollEnabled={false}
                        columnWrapperStyle={{
                            gap: 10, // Reduce spacing between cards
                            paddingHorizontal: 16,
                            marginTop: 16
                        }}
                        renderItem={({ item }) => <MovieCard {...item} />}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
                
                {/* Coming Soon Section - Horizontal Scroll */}
                {/* <SectionHeader title="Coming Soon" />
                <FlatList
                    horizontal
                    data={comingSoon}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => <MovieCard {...item} />}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    showsHorizontalScrollIndicator={false}
                /> */}
            </ScrollView>
        </View>
    );
};

// Section Header Component
const SectionHeader = ({ title }: { title: string }) => (
    <View className="mt-6 px-5">
        <Text className="text-lg font-semibold text-white">{title}</Text>
        <View className="h-0.5 bg-gray-700 w-full mt-2" />
    </View>
);

export default Home;