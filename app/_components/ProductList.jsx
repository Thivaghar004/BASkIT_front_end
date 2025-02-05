"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useLocation } from "../context/LocationContext";
import { useCategory } from "../context/CategoryContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ProductItemDetails from "./ProductItemDetails";


const ProductList = () => {
  const { locationId } = useLocation();  
  const { categoryId } = useCategory();   
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (locationId) {
      let url = `http://localhost:8080/api/items?location_id=${locationId}`;
      if (categoryId) {
        url += `&category_id=${categoryId}`;
      }

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched products:", data);
          setProducts(data || []); 
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setLoading(false);
        });
    }
  }, [locationId, categoryId]); 


  const getProductImage = (itemId) => {
    return `/images/product${itemId}.jpeg`; 
  };

  return (
    <div className="mt-10 p-4">
      <h2 className="text-green-600 font-bold text-2xl text-center mb-6">
        {categoryId ? `Products in Selected Category` : `All Products`}
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.itemId}
              className="border rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform hover:scale-105">
              <div className="relative w-full h-40">
                <Image
                  src={getProductImage(product.itemId)}
                  alt={product.itemName}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-md"
                  onError={(e) => { e.target.src = "/images/default-product.gif"; }} 
                />
              </div>

            <div className="mt-3 text-center">
            <h3 className="text-lg font-semibold">{product.itemName}</h3>
            <p className="text-gray-700 font-medium">₹{product.price}</p>
            <p className={`text-sm ${product.stockAvailability > 0 ? "text-green-600" : "text-red-500"}`}>
              {product.stockAvailability > 0 ? `In Stock` : `Out of Stock`}
            </p>
            
            <Dialog>
            <DialogTrigger asChild className="mt-2">
              <Button variant="outline" disabled={product.stockAvailability <= 0}  className={product.stockAvailability > 0 ? "text-lightgreen border-lightgreen" : "text-red-500 border-red-500 opacity-50 cursor-not-allowed"}>
              Add to cart
            </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{product.itemName}</DialogTitle>
                <DialogDescription>
                  <ProductItemDetails product={product}/>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
            </Dialog>

            </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products available</p>
      )}
    </div>
  );
};

export default ProductList;
