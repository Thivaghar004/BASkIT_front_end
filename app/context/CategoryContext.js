"use client";
import React, { createContext, useContext, useState } from "react";
const CategoryContext = createContext();

export const useCategory = () => {
  return useContext(CategoryContext);
};

export const CategoryProvider = ({ children }) => {
  const [categoryId, setCategoryId] = useState(null);

  return (
    <CategoryContext.Provider value={{ categoryId, setCategory: setCategoryId }}>
      {children}
    </CategoryContext.Provider>
  );
};
