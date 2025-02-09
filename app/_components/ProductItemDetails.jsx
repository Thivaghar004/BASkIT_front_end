"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShoppingBasket } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import axios from "axios";

function ProductItemDetails({ product }) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addItemToCart, fetchCartDetails } = useCart();

  const user = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user")) : null;


  async function handleAddToCart() {
    if (!user || !user.userId) {
      toast.error("Login to add items to cart");
      router.push("/login");
      return;
    }
  
    try {
      await addItemToCart(product, quantity);
      setTimeout(() => fetchCartDetails(), 500); 
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      toast.error("Error adding item to cart.");
    }
  }
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative w-full h-60">
        <Image
          src={`/images/product${product.itemId}.jpeg`}
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
          <Button variant="outline" onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>
            -
          </Button>
          <div className="text-lg">{quantity}</div>
          <Button variant="outline" onClick={() => setQuantity(quantity + 1)} disabled={quantity >= product.stockAvailability}>
            +
          </Button>
        </div>

        <div className="font-bold text-lg mt-2">Total Price: ₹{(product.price * quantity).toFixed(2)}</div>

        <Button className="mt-4" onClick={handleAddToCart}>
          <ShoppingBasket /> Add {quantity} to Cart
        </Button>
      </div>
    </div>
  );
}

export default ProductItemDetails;
