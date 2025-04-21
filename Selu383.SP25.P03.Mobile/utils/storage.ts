import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_KEY = 'user_location';

export const saveUserLocation = async (latitude: number, longitude: number) => {
  try {
    const location = JSON.stringify({ latitude, longitude });
    await AsyncStorage.setItem(LOCATION_KEY, location);
  } catch (e) {
    console.error('Error saving location:', e);
  }
};

export const getUserLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const location = await AsyncStorage.getItem(LOCATION_KEY);
    return location ? JSON.parse(location) : null;
  } catch (e) {
    console.error('Error fetching location:', e);
    return null;
  }
};
