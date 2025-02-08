"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShoppingBasket } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

function ProductItemDetails({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState(null);
  const [cartFetched, setCartFetched] = useState(false);
  const router = useRouter();

  const user = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user")) : null;

  useEffect(() => {
    if (user && !cartFetched) {
      fetchCart();
    }
  }, [user]);

  async function fetchCart() {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      if (!storedUser || !storedUser.userId) {
        console.warn("User not found in session storage.");
        return;
      }
  
      const response = await axios.get(`http://localhost:8080/api/carts/user/${storedUser.userId}`);
  
      if (response.status === 200 && response.data.cartId) {
        console.log("✅ Cart retrieved:", response.data);
  
        // ✅ Avoid recursive storage
        const cleanedCart = {
          cartId: response.data.cartId,
          userId: response.data.user.userId,
          address: response.data.address,
          lastUpdatedDate: response.data.lastUpdatedDate
        };
  
        sessionStorage.setItem("cart", JSON.stringify(cleanedCart));
        setCart(cleanedCart);
      } else {
        console.warn("No existing cart found. Creating a new one...");
        await createCart(); 
      }
    } catch (error) {
      console.error("❌ Error fetching cart:", error.response?.data || error.message);
      toast.error("Failed to retrieve cart.");
    }
  }
  

  async function createCart() {
    let storedCart = JSON.parse(sessionStorage.getItem("cart"));
    if (storedCart && storedCart.cartId) {
      console.log("Cart already exists, no need to create a new one.");
      return;
    } 
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      if (!storedUser || !storedUser.userId) {
        toast.error("User not found. Please login.");
        router.push("/login");
        return;
      }

      const res = await axios.post("http://localhost:8080/api/carts", {
        userId: storedUser.userId,
        address: storedUser.address || "Not Provided",
      });

      if (res.status === 200 || res.status === 201) {
        setCart(res.data);
        sessionStorage.setItem("cart", JSON.stringify(res.data));
        toast.success("New cart created! 🎉");
      }
    } catch (err) {
      console.error("Error creating cart:", err);
      toast.error("Failed to create cart");
    }
  }

  async function handleAddToCart() {
    if (!user || !user.userId) {
      toast.error("Login to add items to cart");
      router.push("/login");
      return;
    }
  
    let storedCart = JSON.parse(sessionStorage.getItem("cart"));
  
    // 🔹 Ensure cart exists before adding items
    if (!storedCart || !storedCart.cartId) {
      console.warn("Cart not found. Fetching or creating cart...");
  
      await fetchCart(); // Ensures cart is retrieved or created
      storedCart = JSON.parse(sessionStorage.getItem("cart")); // Retrieve the latest cart
  
      if (!storedCart || !storedCart.cartId) {
        console.error("Cart creation failed. Unable to add item.");
        toast.error("Cart creation failed.");
        return;
      }
    }
  
    // ✅ **Debug: Ensure required fields exist**
    if (!storedCart.cartId || !product?.itemId || quantity <= 0) {
      console.error("Missing required fields:", {
        cartId: storedCart?.cartId,
        itemId: product?.itemId,
        quantity: quantity,
      });
      toast.error("Failed to add item: Missing required fields.");
      return;
    }
  
    // ✅ **Now send request**
    try {
      const payload = {
        cartId: storedCart.cartId,
        itemId: product.itemId,
        quantity: quantity,
      };
  
      console.log("Sending Data to Backend:", payload);
  
      const response = await axios.post("http://localhost:8080/api/list-of-items", payload);
  
      if (response.status === 200 || response.status === 201) {
        toast.success("Item added to cart successfully!");
      } else {
        toast.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message, error);
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
