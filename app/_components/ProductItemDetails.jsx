"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShoppingBasket } from "lucide-react";

function ProductItemDetails({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [productTotalPrice, setProductTotalPrice] = useState(product.price);

  const handleIncrease = () => {
    if (quantity < product.stockAvailability) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const getProductImage = (itemId) => {
    return `/images/product${itemId}.jpeg`; 
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative w-full h-60">
        <Image
          src={getProductImage(product.itemId)}
          alt={product.itemName}
          layout="fill"
          objectFit="contain"
          className="rounded-md border"
          onError={(e) => { e.target.src = "/images/default-product.gif"; }} 
        />
      </div>


      <div>
        <div className="text-gray-700 font-bold text-xl">₹{product.price}</div>
        <div className="text-gray-500 text-xl">Category: {product.categoryName || "Category not available"}</div>
        <div className="text-sm text-gray-600">
          Stock Availability: {product.stockAvailability}
        </div>


        <div className="flex gap-4 mt-4 items-center">
          <Button
            variant="outline"
            onClick={handleDecrease}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <div className="text-lg">{quantity}</div>
          <Button
            variant="outline"
            onClick={handleIncrease}
            disabled={quantity >= product.stockAvailability}
          >
            +
          </Button>
        </div>


        <div className="font-bold text-lg mt-2">Total Price: ₹{(productTotalPrice * quantity).toFixed(2)}</div>

        <Button
          className="mt-4"
          onClick={() => console.log(`Added ${quantity} of ${product.itemName} to cart`)} // Handle add to cart functionality
        >
          <ShoppingBasket /> Add {quantity} to Cart
        </Button>
      </div>
    </div>
  );
}

export default ProductItemDetails;
