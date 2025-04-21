import React, { createContext, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "@/constants/baseUrl";

type Theater = {
  id: number;
  name: string;
  address: string;
  seatCount: number;
};

type TheaterContextType = {
  theater: Theater | null;
  setTheater: (theater: Theater) => void;
  loadingTheater: boolean;
};

const TheaterContext = createContext<TheaterContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const TheaterProvider = ({ children }: Props) => {
  const [theater, setTheater] = useState<Theater | null>(null);
  const [loadingTheater, setLoadingTheater] = useState(true);

  useEffect(() => {
    const loadTheater = async () => {
      try {
        const saved = await AsyncStorage.getItem("selectedTheater");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.id) {
            console.log(" Using saved theater from AsyncStorage:", parsed.name);
            setTheater(parsed);
            setLoadingTheater(false);
            return;
          }
        }
      } catch (e) {
        console.warn(" Failed to load saved theater:", e);
        await AsyncStorage.removeItem("selectedTheater");
      }

      findNearestTheater();
    };

    loadTheater();
  }, []);

  useEffect(() => {
    if (theater) {
      AsyncStorage.setItem("selectedTheater", JSON.stringify(theater));
    }
  }, [theater]);

  const findNearestTheater = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn(" Location permission denied.");
        const fallback = await getFallbackTheater();
        setTheater(fallback);
        setLoadingTheater(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const res = await axios.get<Theater[]>(`${BASE_URL}/api/theaters`);
      const theaters = res.data;

      const theatersWithCoords = await Promise.all(
        theaters.map(async (t) => {
          const coords = await geocodeAddress(t.address);
          return { ...t, ...coords };
        })
      );

      const nearest = findNearest(userLat, userLng, theatersWithCoords);
      console.log(" Nearest theater:", nearest.name);
      setTheater(nearest);
    } catch (err) {
      console.error(" Failed to fetch theaters or location:", err);
      const fallback = await getFallbackTheater();
      setTheater(fallback);
    } finally {
      setLoadingTheater(false);
    }
  };

  return (
    <TheaterContext.Provider value={{ theater, setTheater, loadingTheater }}>
      {children}
    </TheaterContext.Provider>
  );
};

export const useTheater = () => {
  const context = useContext(TheaterContext);
  if (!context) throw new Error("useTheater must be used within TheaterProvider");
  return context;
};

// 🔍 Geocode address to lat/lng using Nominatim
const geocodeAddress = async (address: string) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data?.length) throw new Error("No results for address");
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.error("Geocoding failed:", address, err);
    return { lat: 0, lng: 0 };
  }
};

// 📏 Haversine formula to find closest
const findNearest = (
  userLat: number,
  userLng: number,
  theaters: (Theater & { lat: number; lng: number })[]
): Theater => {
  let closest = theaters[0];
  let minDist = Infinity;

  theaters.forEach((t) => {
    const d = getDistance(userLat, userLng, t.lat, t.lng);
    if (d < minDist) {
      minDist = d;
      closest = t;
    }
  });

  return closest;
};

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const getFallbackTheater = async (): Promise<Theater> => {
  try {
    const res = await axios.get<Theater[]>(`${BASE_URL}/api/theaters`);
    return res.data[0];
  } catch {
    return {
      id: 0,
      name: "Default Theater",
      address: "Unknown",
      seatCount: 0,
    };
  }
};
