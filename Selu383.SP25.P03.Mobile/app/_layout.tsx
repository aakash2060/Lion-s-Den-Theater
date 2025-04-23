import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { AuthProvider } from '@/context/AuthContext';
import { SearchProvider } from '@/context/SearchContext';
import { TheaterProvider } from '@/context/TheaterContext';
import { BookingProvider } from '@/context/BookingContext';
import TheaterGuard from "@/components/TheaterGuard";
import { useColorScheme } from '@/hooks/useColorScheme';

import { StripeProvider } from '@stripe/stripe-react-native';
import { BASE_URL } from '@/constants/baseUrl'; // your constant for backend base URL

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [stripeKey, setStripeKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchStripeKey = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/payments/public-key`);
        const data = await res.json();
        setStripeKey(data.publicKey);
      } catch (err) {
        console.error("Failed to fetch Stripe key:", err);
      }
    };

    fetchStripeKey();
  }, []);

  useEffect(() => {
    if (loaded && stripeKey) {
      SplashScreen.hideAsync();
    }
  }, [loaded, stripeKey]);

  if (!loaded || !stripeKey) {
    return null; // Optional: return a loading spinner
  }

  return (
    <StripeProvider publishableKey={stripeKey}>
      <AuthProvider>
        <TheaterProvider>
          <BookingProvider>
            <SearchProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <TheaterGuard>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="index" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                </TheaterGuard>
                <StatusBar style="auto" />
              </ThemeProvider>
            </SearchProvider>
          </BookingProvider>
        </TheaterProvider>
      </AuthProvider>
    </StripeProvider>
  );
}
