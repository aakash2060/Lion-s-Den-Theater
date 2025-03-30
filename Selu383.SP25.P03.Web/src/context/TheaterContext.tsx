import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from "react";
  import { theaterService, Theater } from "../services/api";
  
  interface TheaterContextType {
    theater: string;
    setTheater: (theater: string) => void;
  }
  
  const TheaterContext = createContext<TheaterContextType | undefined>(undefined);
  
  interface TheaterProviderProps {
    children: ReactNode;
  }
  
  export const TheaterProvider = ({ children }: TheaterProviderProps) => {
    const [theater, setTheater] = useState<string>("");
  
    // Persist theater in localStorage when it changes
    useEffect(() => {
      if (theater) {
        localStorage.setItem("selectedTheater", theater);
      }
    }, [theater]);
  
    // Auto-select nearest theater on first load
    useEffect(() => {
      const loadAndSelectNearestTheater = async () => {
        try {
          const theaters = await theaterService.getAll();
  
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
              const userLat = position.coords.latitude;
              const userLng = position.coords.longitude;
  
              const theatersWithCoords = await Promise.all(
                theaters.map(async (t: Theater) => {
                  const geo = await geocodeAddress(t.address);
                  return { ...t, ...geo };
                })
              );
  
              const nearest = findNearest(userLat, userLng, theatersWithCoords);
              if (nearest) {
                setTheater(nearest.name);
                localStorage.setItem("selectedTheater", nearest.name);
              }
            });
          } else {
            console.warn("Geolocation not available.");
          }
        } catch (error) {
          console.error("Failed to auto-select nearest theater:", error);
        }
      };
  
      const savedTheater = localStorage.getItem("selectedTheater");
      if (savedTheater) {
        setTheater(savedTheater);
      } else {
        loadAndSelectNearestTheater();
      }
    }, []);
  
    return (
      <TheaterContext.Provider value={{ theater, setTheater }}>
        {children}
      </TheaterContext.Provider>
    );
  };
  
  export const useTheater = () => {
    const context = useContext(TheaterContext);
    if (!context) {
      throw new Error("useTheater must be used within a TheaterProvider");
    }
    return context;
  };
  
  // 🌍 Geocode address using OpenStreetMap API
  const geocodeAddress = async (
    address: string
  ): Promise<{ lat: number; lng: number }> => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await response.json();
    if (!data || data.length === 0) throw new Error("Geocoding failed");
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  };
  
  // 📍 Find nearest theater using Haversine formula
  const findNearest = (
    userLat: number,
    userLng: number,
    theaters: (Theater & { lat: number; lng: number })[]
  ) => {
    let closest = null;
    let minDistance = Infinity;
  
    for (const theater of theaters) {
      const dist = getDistance(userLat, userLng, theater.lat, theater.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closest = theater;
      }
    }
  
    return closest;
  };
  
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  const toRad = (value: number): number => (value * Math.PI) / 180;
  