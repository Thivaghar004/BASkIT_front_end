"use client";
import React, { createContext, useContext, useState } from "react";


const LocationContext = createContext();


export const useLocation = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }) => {
  const [locationId, setLocationId] = useState();

  const setLocation = (newLocationId) => {
    setLocationId(newLocationId);
  };

  return (
    <LocationContext.Provider value={{ locationId, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};