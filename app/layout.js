"use client";
import { Outfit } from "next/font/google";
import Head from 'next/head';
import "./globals.css";
import Header from "./_components/Header";
import { LocationProvider } from "./context/LocationContext";
import { CategoryProvider } from "./context/CategoryContext";
import { icons, Sliders } from "lucide-react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast"
import { CartProvider } from "./context/CartContext";

const outfit = Outfit({
  variable: "--font-Outfit",
  subsets: ["latin"],
});



//export const metadata = {
//  title: "Baskit",
//  icons: "logo.png",
//  description: "Generated by create next app",
//};

export default function RootLayout({ children }) {
  const params=usePathname();
  const showHeader=params=='/login' || params=='/register'?false:true;

  return (
    <html lang="en">
      <body className={outfit.variable}>
      <Toaster position="bottom-right" />
        <LocationProvider>
          <CategoryProvider>
            <CartProvider>
            {showHeader&&<Header/>}
            {children}
            </CartProvider>
          </CategoryProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
