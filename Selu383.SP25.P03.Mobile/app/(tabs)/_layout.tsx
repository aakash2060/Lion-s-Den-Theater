import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Navbar from '@/components/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function TabLayout() {
  const colorScheme = useColorScheme();
 
  return (
    <View className="flex-1 bg-black">
      {/* Navbar always on top */}
      <Navbar/>

     
      <Tabs
        screenOptions={{
          headerShown: false, // This ensures no tab bar appears at the top
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="foods"
          options={{
            title: 'Food and Drinks',
            tabBarIcon: ({ color }) => <Icon name="cutlery" size={28} color={color}/>,
          }}
        />
      </Tabs>
    </View>
  );
}