"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the context and its type
interface CityContextType {
  city: string;
  setCity: (city: string) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCity] = useState<string>(""); // Default city can be empty or set to a default value

  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
};

// Custom hook to use the city context
export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
};
