import React, { createContext, useContext, useState } from "react";

type Theater = {
  id: number;
  name: string;
  address: string;
  seatCount: number;
  latitude?: number;
  longitude?: number;
};

type TheaterContextType = {
  theater: Theater | null;
  setTheater: (theater: Theater) => void;
  loadingTheater: boolean;
  setLoadingTheater: (loading: boolean) => void;
};

const TheaterContext = createContext<TheaterContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const TheaterProvider = ({ children }: Props) => {
  const [theater, setTheater] = useState<Theater | null>(null);
  const [loadingTheater, setLoadingTheater] = useState(true);

  return (
    <TheaterContext.Provider
      value={{
        theater,
        setTheater,
        loadingTheater,
        setLoadingTheater,
      }}
    >
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
