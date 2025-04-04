import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { theaterService, Theater } from "../services/api"; // Ensure that theaterService is used

interface TheaterContextType {
  theater: Theater | null;
  setTheater: (theater: Theater) => void;
  loadingTheater: boolean;
}

const TheaterContext = createContext<TheaterContextType | undefined>(undefined);

export const TheaterProvider = ({ children }: { children: ReactNode }) => {
  const [theater, setTheater] = useState<Theater | null>(null);
  const [loadingTheater, setLoadingTheater] = useState(true); // Loading state for theater

  useEffect(() => {
    const saved = localStorage.getItem("selectedTheater");

    try {
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === "object" && parsed !== null && "id" in parsed) {
          console.log("✅ Using saved theater from localStorage:", parsed.name);
          setTheater(parsed);  // Use the saved theater from localStorage
          setLoadingTheater(false);
          return;
        }
      }
    } catch (err) {
      console.warn("⚠️ Invalid saved theater format. Clearing...");
      localStorage.removeItem("selectedTheater");
    }

    // Only call loadNearestTheater if no saved theater exists
    loadNearestTheater();
  }, []); // Only run on initial load

  useEffect(() => {
    if (theater) {
      localStorage.setItem("selectedTheater", JSON.stringify(theater)); // Save theater in localStorage
    }
  }, [theater]);

  // Function to load the nearest theater using geolocation
  const loadNearestTheater = async () => {
    try {
      console.log("📦 Fetching all theaters...");
      const theaters: Theater[] = await theaterService.getAll(); // Fetch all theaters

      // Check if geolocation is available
      if (!navigator.geolocation) {
        console.warn("🚫 Geolocation not supported. Falling back.");
        // If no geolocation, just fallback to first theater in list (if no theater set yet)
        setTheater(theaters[0]);
        setLoadingTheater(false);
        return;
      }

      console.log("📍 Attempting to use geolocation...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          console.log("📌 User location:", userLat, userLng);

          console.log("🌐 Geocoding each theater address...");
          const theatersWithCoords = await Promise.all(
            theaters.map(async (t: Theater) => {
              const coords = await geocodeAddress(t.address);
              return { ...t, ...coords };
            })
          );

          const nearest = findNearest(userLat, userLng, theatersWithCoords);
          console.log("🎯 Nearest theater found:", nearest.name);

          setTheater(nearest);
          setLoadingTheater(false);  // Update loading state when done
        },
        (err) => {
          console.warn("⚠️ Geolocation error:", err.message);
          // Fallback to the first theater in the list only if no theater is already set
          if (!theater) {
            setTheater(theaters[0]);
          }
          setLoadingTheater(false); // Stop loading when geolocation fails
        }
      );

      // Timeout fallback after 5 seconds if no theater has been set
      setTimeout(() => {
        if (!theater) {
          console.warn("⏰ Timeout fallback triggered...");
          setTheater(theaters[0]);  // Set first theater if still undefined
          setLoadingTheater(false);
        }
      }, 5000);
    } catch (error) {
      console.error("❌ Failed to fetch theaters or geolocate:", error);
      setLoadingTheater(false); // Stop loading if there is an error
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

// Geocode address to get lat/lng
const geocodeAddress = async (address: string) => {
  try {
    console.log("📦 Geocoding address:", address);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await res.json();
    if (!data?.length) throw new Error("No results for address");
    console.log("Geocoded Coordinates:", data[0].lat, data[0].lon);  // Log coordinates
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.error("❌ Geocoding failed for:", address, err);
    return { lat: 0, lng: 0 }; // fallback coordinates
  }
};

// Function to calculate the nearest theater based on distance
const findNearest = (
  userLat: number,
  userLng: number,
  theaters: (Theater & { lat: number; lng: number })[]
): Theater => {
  let closest = theaters[0];
  let minDist = Infinity;
  theaters.forEach((t) => {
    const d = getDistance(userLat, userLng, t.lat, t.lng);
    console.log(`Distance to ${t.name}: ${d} km`);  // Log distances to each theater
    if (d < minDist) {
      minDist = d;
      closest = t;
    }
  });
  return closest;
};

// Haversine formula to calculate distance between two coordinates (in km)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;  // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};
