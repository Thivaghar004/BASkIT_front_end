"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { LayoutGrid, Search, ShoppingBag, MapPin } from "lucide-react";
import { useLocation } from "../context/LocationContext"; 
import { useCategory } from "../context/CategoryContext";
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
    const { locationId, setLocation } = useLocation();
    const { categoryId, setCategory } = useCategory();
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState({ categories: true, locations: true });

    
    useEffect(() => {
        fetch("http://localhost:8080/api/categories")
            .then(response => response.json())
            .then(data => {
                setCategories(data);
                setLoading(prev => ({ ...prev, categories: false }));
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
                setLoading(prev => ({ ...prev, categories: false }));
            });
    }, []);

    
    useEffect(() => {
        fetch("http://localhost:8080/api/locations")  
            .then(response => response.json())
            .then(data => {
                setLocations(data);
                setLoading(prev => ({ ...prev, locations: false }));
            })
            .catch(error => {
                console.error("Error fetching locations:", error);
                setLoading(prev => ({ ...prev, locations: false }));
            });
    }, []);

    return (
        <div className='p-2 shadow-sm flex justify-between items-center'>
            <div className='flex items-center gap-8'>
              
                <Image src="/logo.png" alt="Logo" width={50} height={100} />

                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <h2 className="md:flex gap-2 items-center border rounded-full p-2 px-10 bg-slate-200 hidden cursor-pointer">
                            <LayoutGrid className="h-5 w-5" /> {categories.find(cat => cat.categoryId === categoryId)?.categoryName || "Select Category"}
                        </h2>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        <DropdownMenuLabel>Browse Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
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

                
                <div className='md:flex gap-3 items-center border rounded-full p-2 px-5 hidden'>
                    <Search />
                    <input type='text' placeholder='Search' className='outline-none' />
                </div>
            </div>

            <div className='flex gap-8 items-center'>
              
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <h2 className="md:flex gap-2 items-center border rounded-full p-2 px-10 bg-slate-200 hidden cursor-pointer">
                            <MapPin className="h-5 w-5" /> {locations.find(loc => loc.locationId === locationId)?.locationName || "Select Location"}
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
                                    onClick={() => setLocation(location.locationId)} 
                                >
                                    <h2>{location.locationName}</h2>
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem>No Locations Available</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                
                <h2 className='flex gap-2 text-lg'><ShoppingBag /> 0</h2>
                <Button>Login</Button>
            </div>
        </div>
    );
}

export default Header;
