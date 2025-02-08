"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { LayoutGrid, Search, ShoppingBag, MapPin, CircleUserRound } from "lucide-react";
import { useLocation } from "../context/LocationContext";
import { useCategory } from "../context/CategoryContext";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

function Header() {
    const { locationId, setLocation } = useLocation();
    const { categoryId, setCategory } = useCategory();
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState({ categories: true, locations: true });
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.name && userData.email) {
                setUser(userData);
            }
            if (userData.locationId) {
                setLocation(userData.locationId);
            }
            fetchCart(userData.userId); // Fetch cart count on load
        }
    }, [setLocation]);

    function handleLogout() {
        sessionStorage.removeItem("user");
        setUser(null);
        window.location.href = "/login";
    }

    async function fetchCart(userId) {
        try {
            const response = await axios.get(`http://localhost:8080/api/carts/user/${userId}`);
            if (response.status === 200) {
                setCartCount(response.data.listOfItems.length);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }

    useEffect(() => {
        fetch("http://localhost:8080/api/categories")
            .then((response) => response.json())
            .then((data) => {
                setCategories(data);
                setLoading((prev) => ({ ...prev, categories: false }));
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setLoading((prev) => ({ ...prev, categories: false }));
            });
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/api/locations")
            .then((response) => response.json())
            .then((data) => {
                setLocations(data);
                setLoading((prev) => ({ ...prev, locations: false }));
            })
            .catch((error) => {
                console.error("Error fetching locations:", error);
                setLoading((prev) => ({ ...prev, locations: false }));
            });
    }, []);

    function handleLocationChange(newLocationId) {
        setLocation(newLocationId);
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        if (storedUser) {
            storedUser.locationId = newLocationId;
            sessionStorage.setItem("user", JSON.stringify(storedUser));
        }
    }

    return (
        <div className="p-2 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-8">
                <Image src="/logo.png" alt="Logo" width={50} height={100} />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <h2 className="md:flex gap-2 items-center border rounded-full p-2 px-10 bg-slate-200 hidden cursor-pointer">
                            <LayoutGrid className="h-5 w-5" />{" "}
                            {categories.find((cat) => cat.categoryId === categoryId)?.categoryName || "Select Category"}
                        </h2>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        <DropdownMenuLabel>Browse Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex gap-2 items-center cursor-pointer font-semibold" onClick={() => setCategory(null)}>
                            <h2>All Categories</h2>
                        </DropdownMenuItem>
                        {loading.categories ? (
                            <DropdownMenuItem>Loading...</DropdownMenuItem>
                        ) : categories.length > 0 ? (
                            categories.map((category) => (
                                <DropdownMenuItem
                                    key={category.categoryId}
                                    className="flex gap-2 items-center cursor-pointer"
                                    onClick={() => setCategory(category.categoryId)}
                                >
                                    <h2>{category.categoryName}</h2>
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem>No Categories Available</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="md:flex gap-3 items-center border rounded-full p-2 px-5 hidden">
                    <Search />
                    <input type="text" placeholder="Search" className="outline-none" />
                </div>
            </div>

            <div className="flex gap-8 items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <h2 className="md:flex gap-2 items-center border rounded-full p-2 px-10 bg-slate-200 hidden cursor-pointer">
                            <MapPin className="h-5 w-5" />{" "}
                            {locations.find((loc) => loc.locationId === locationId)?.locationName || "Select Location"}
                        </h2>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        <DropdownMenuLabel>Select Location</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {loading.locations ? (
                            <DropdownMenuItem>Loading...</DropdownMenuItem>
                        ) : locations.length > 0 ? (
                            locations.map((location) => (
                                <DropdownMenuItem
                                    key={location.locationId}
                                    className="flex gap-2 items-center cursor-pointer"
                                    onClick={() => handleLocationChange(location.locationId)}
                                >
                                    <h2>{location.locationName}</h2>
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem>No Locations Available</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* ✅ Shopping Bag Icon with Red Counter */}
                <h2 className="flex gap-2 text-lg relative">
                    <ShoppingBag />
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {cartCount}
                    </span>
                </h2>

                {user ? (
                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <CircleUserRound className="bg-green-100 p-1 rounded-full h-10 w-10 text-green-600" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>
                                    <p className="font-semibold text-green-600">Welcome, {user.name}!</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="outline" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Link href="/login">
                            <Button>Login</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
