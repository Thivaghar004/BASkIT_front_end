"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartId, setCartId] = useState(null);
  const [user, setUser] = useState(() => {
    return typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user") || "null") : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(sessionStorage.getItem("user") || "null");
      if (updatedUser?.userId !== user?.userId) {
        setUser(updatedUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]);

  const fetchCartDetails = useCallback(async () => {
    const user = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user") || "null") : null;
    if (!user) return;

    try {
      const response = await axios.get(`http://localhost:8080/api/carts/user/${user.userId}`);
      if (response.status === 200 && response.data.cartId) {
        const cartData = response.data;
        setCartId(cartData.cartId);
        setCartItems([...cartData.listOfItems]);
        setCartCount(cartData.listOfItems.length);
        setTotalPrice(cartData.listOfItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0));
        sessionStorage.setItem("cartId", cartData.cartId.toString());
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn("🚨 No existing cart found. Creating a new one...");
        await createCart(user.userId);
      } else {
        console.error("❌ Error fetching cart:", error);
        toast.error("Failed to fetch cart items");
      }
    }
  }, []);

  useEffect(() => {
    if (user?.userId) {
      fetchCartDetails();
    }
  }, [fetchCartDetails]);

  // Create a new cart if none exists
  async function createCart(userId) {
    try {
      const response = await axios.post("http://localhost:8080/api/carts", {
        userId: userId,
        address: "Not Provided",
      });
  
      if (response.status === 200 || response.status === 201) {
        const newCartId = response.data.cartId;
        setCartId(newCartId); // Set the new cart ID
        sessionStorage.setItem("cartId", newCartId.toString()); // Store it in sessionStorage
        setCartItems([]); // Make sure the cart starts empty
        toast.success("New cart created! 🎉");
        await fetchCartDetails(); // Fetch cart details after creating
      }
    } catch (error) {
      console.error("❌ Error creating cart:", error);
      toast.error("Failed to create cart.");
    }
  }

  // Add an item to the cart
  async function addItemToCart(product, quantity) {
    const user = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user") || "null") : null;
    if (!user) {
      toast.error("Login to add items to cart");
      return;
    }

    try {
      const payload = {
        cartId: cartId,
        itemId: product.itemId,
        quantity: quantity,
      };

      const response = await axios.post("http://localhost:8080/api/list-of-items", payload);
      if (response.status === 200 || response.status === 201) {
        toast.success("Item added to cart!");
        await fetchCartDetails();
      } else {
        toast.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding item to cart.");
    }
  }

  // Update quantity of an item in the cart
  async function updateItemQuantity(listItemId, newQuantity, itemId) {
    try {
      if (newQuantity < 1) {
        await removeItem(listItemId);
        return;
      }

      const response = await axios.put(`http://localhost:8080/api/list-of-items/${listItemId}`, {
        cartId: cartId,
        itemId: itemId,
        quantity: newQuantity,
      });

      if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.map((item) => (item.id === listItemId ? { ...item, quantity: newQuantity } : item))
        );
        await fetchCartDetails();
        toast.success("Cart updated!");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  }

  // Remove an item from the cart
  async function removeItem(listItemId) {
    try {
      await axios.delete(`http://localhost:8080/api/list-of-items/${listItemId}`);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== listItemId));
      await fetchCartDetails();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalPrice,
        cartId,
        fetchCartDetails,
        addItemToCart,
        updateItemQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
