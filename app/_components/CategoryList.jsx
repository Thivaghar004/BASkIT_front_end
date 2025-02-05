"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCategory } from "../context/CategoryContext"; 

const CategoryList = () => {
  const { categoryId, setCategory } = useCategory(); 

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const getCategoryImage = (categoryName) => {
    if (!categoryName) return "/images/default.png";

    switch (categoryName.toLowerCase()) {
      case "fruits":
        return "/images/fruits.png";
      case "vegetables":
        return "/images/vegetables.png";
      case "dairy products":
        return "/images/dairy.png";
      case "bakery products":
        return "/images/bakery.png";
      case "meat":
        return "/images/meat.png";
      case "seafood":
        return "/images/seafood.png";
      default:
        return "/images/default.png";
    }
  };

  return (
    <div className="mt-10 p-4">
      <h2 className="text-green-600 font-bold text-2xl text-center mb-6">Shop by Category</h2>

      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.categoryId}
              className={`relative rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105 bg-green-50 p-2 hover:bg-green-300
                ${category.categoryId === categoryId ? "border-4 border-green-600" : ""}`} 
              onClick={() => setCategory(category.categoryId)} 
            >
              <div className="relative w-full h-[120px]">
                <Image
                  src={getCategoryImage(category.categoryName)}
                  alt={category.categoryName}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-md"
                />
              </div>
              
              <div className="text-center mt-2">
                <h3 className="text-sm md:text-base font-semibold">{category.categoryName}</h3>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No categories available</p>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
