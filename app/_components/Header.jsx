"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { LayoutGrid, Search, ShoppingBag, MapPin, CircleUserRound, Plus, Minus, Trash2 } from "lucide-react"
import { useLocation } from "../context/LocationContext"
import { useCategory } from "../context/CategoryContext"
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button"
import axios from "axios"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { toast } from "react-hot-toast"
import Link from "next/link"

function Header() {
  const router = useRouter();
  const { locationId, setLocation } = useLocation()
  const { categoryId, setCategory } = useCategory()
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState({ categories: true, locations: true })
  const [user, setUser] = useState(null)
  const { cartItems, cartCount, totalPrice, updateItemQuantity, removeItem, fetchCartDetails } = useCart();
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      if (userData.name && userData.email) {
        setUser(userData)
      }
      if (userData.locationId) {
        setLocation(userData.locationId)
      }
    }
  }, [setLocation])

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(sessionStorage.getItem("user") || "null");
      if (updatedUser?.userId !== user?.userId) {
        setUser(updatedUser);
        fetchCartDetails(updatedUser.userId); // Fetch cart immediately
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]);

  useEffect(() => {
    fetchCartDetails(user?.userId);
  }, [cartItems.length]);

  function handleLogout() {
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("cartId")
    setUser(null)
    window.location.href = "/login"
  }

  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data)
        setLoading((prev) => ({ ...prev, categories: false }))
      })
      .catch((error) => {
        console.error("Error fetching categories:", error)
        setLoading((prev) => ({ ...prev, categories: false }))
      })
  }, [])

  useEffect(() => {
    fetch("http://localhost:8080/api/locations")
      .then((response) => response.json())
      .then((data) => {
        setLocations(data)
        setLoading((prev) => ({ ...prev, locations: false }))
      })
      .catch((error) => {
        console.error("Error fetching locations:", error)
        setLoading((prev) => ({ ...prev, locations: false }))
      })
  }, [])

  function handleLocationChange(newLocationId) {
    setLocation(newLocationId)
    const storedUser = JSON.parse(sessionStorage.getItem("user"))
    if (storedUser) {
      storedUser.locationId = newLocationId
      sessionStorage.setItem("user", JSON.stringify(storedUser))
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
            <DropdownMenuItem
              className="flex gap-2 items-center cursor-pointer font-semibold"
              onClick={() => setCategory(null)}
            >
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

        <Sheet>
        <SheetTrigger>
          <h2 className="flex gap-2 text-lg relative">
            <ShoppingBag />
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {cartCount}
            </span>
          </h2>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>My Cart ({cartCount} items)</SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex flex-col gap-4 h-[calc(100vh-200px)] overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-4">Your cart is empty</div>
            ) : (
              cartItems.map((cartItem) => (
                <div key={cartItem.id} className="flex gap-4 border-b pb-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={`/images/product${cartItem.item.itemId}.jpeg`}
                      alt={cartItem.item.itemName || "Product image"}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{cartItem.item.itemName}</h3>
                    <p className="text-sm text-gray-500">
                      ₹{cartItem.item.price} × {cartItem.quantity} = ₹
                      {(cartItem.item.price * cartItem.quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="icon" onClick={() => updateItemQuantity(cartItem.id, cartItem.quantity - 1, cartItem.item.itemId)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{cartItem.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => updateItemQuantity(cartItem.id, cartItem.quantity + 1, cartItem.item.itemId)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="ml-auto text-red-500" onClick={() => removeItem(cartItem.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <SheetFooter className="mt-auto border-t pt-4">
              <div className="w-full">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
                </div>
                <SheetClose asChild onClick={()=>router.push('/checkout')}><Button className="w-full" disabled={cartItems.length === 0}>
                  Proceed to Buy
                </Button>
                </SheetClose>
              </div>
            </SheetFooter>
        </SheetContent>
      </Sheet>

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
  )
}

export default Header

