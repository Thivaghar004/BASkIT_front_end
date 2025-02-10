"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { ArrowBigRight } from "lucide-react"
import axios from "axios"
import { useCart } from "@/app/context/CartContext" // Import the useCart hook

function Checkout() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    pincode: "",
    address: "",
  })
  const [modifiedFields, setModifiedFields] = useState({})
  const { cartItems, totalPrice, fetchCartDetails } = useCart() // Use the cart context

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user")

    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)

      setFormData((prevData) => ({
        ...prevData,
        name: userData.name || "",
        email: userData.email || "",
        address: userData.address || "",
      }))

      if (!userData.phoneNo || !userData.location?.locationId) {
        fetchUpdatedUserDetails(userData.userId)
      } else {
        setFormData((prevData) => ({
          ...prevData,
          phoneNumber: userData.phoneNo || "",
          pincode: userData.location?.locationId || "",
        }))
      }

      // Fetch cart details when component mounts
      fetchCartDetails()
    } else {
      toast.error("Please log in to access checkout")
      router.push("/login")
    }
  }, [fetchCartDetails]) // Added fetchCartDetails to dependencies

  async function fetchUpdatedUserDetails(userId) {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`)
      if (response.status === 200) {
        const updatedUser = response.data
        setFormData((prevData) => ({
          ...prevData,
          phoneNumber: updatedUser.phoneNo || prevData.phoneNumber,
          pincode: updatedUser.location?.locationId || prevData.pincode,
        }))
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      toast.error("Failed to load user details.")
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
    setModifiedFields((prev) => ({ ...prev, [name]: true }))
  }

  function getTextColor(field) {
    return modifiedFields[field] ? "text-black" : "text-gray-500"
  }

  // Calculate delivery charge and tax
  const deliveryCharge = 19.99 // Example fixed delivery charge
  const taxRate = 0.025 // 2.5% tax rate
  const subtotal = totalPrice
  const tax = subtotal * taxRate
  const total = subtotal + deliveryCharge + tax

  if (!user) return null

  return (
    <div className="p-5 md:px-10">
      <h2 className="p-3 bg-green-500 text-xl font-bold text-center text-white rounded-md">Checkout</h2>
      <div className="grid md:grid-cols-3 gap-6 py-8">
        {/* Billing Details */}
        <div className="md:col-span-2 bg-white p-6 rounded-md shadow-md">
          <h2 className="font-bold text-2xl mb-4">Billing Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {["name", "email"].map((field, index) => (
              <div key={index} className="relative">
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md peer ${getTextColor(field)} focus:ring-2 focus:ring-green-500 focus:outline-none`}
                  placeholder=" "
                />
                <label
                  className={`absolute left-3 -top-2.5 bg-white px-1 text-sm transition-all duration-200 ${
                    formData[field] ? "text-gray-600" : "text-transparent peer-focus:text-gray-600"
                  }`}
                >
                  {field === "name" ? "Full Name" : "Email"}
                </label>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {["phoneNumber", "pincode"].map((field, index) => (
              <div key={index} className="relative">
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md peer ${getTextColor(field)} focus:ring-2 focus:ring-green-500 focus:outline-none`}
                  placeholder=" "
                />
                <label
                  className={`absolute left-3 -top-2.5 bg-white px-1 text-sm transition-all duration-200 ${
                    formData[field] ? "text-gray-600" : "text-transparent peer-focus:text-gray-600"
                  }`}
                >
                  {field === "phoneNumber" ? "Phone Number" : "Pincode"}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-4 relative">
            <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md peer ${getTextColor("address")} focus:ring-2 focus:ring-green-500 focus:outline-none`}
              placeholder=" "
            />
            <label
              className={`absolute left-3 -top-2.5 bg-white px-1 text-sm transition-all duration-200 ${
                formData.address ? "text-gray-600" : "text-transparent peer-focus:text-gray-600"
              }`}
            >
              Address
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="p-3 bg-gray-200 font-bold text-center rounded-md">Total Cart</h2>
          <div className="p-4 flex flex-col gap-4">
            <h2 className="font-bold flex justify-between">
              Subtotal: <span>₹{subtotal.toFixed(2)}</span>
            </h2>
            <hr />
            <h2 className="flex justify-between">
              Delivery Charge: <span>₹{deliveryCharge.toFixed(2)}</span>
            </h2>
            <h2 className="flex justify-between">
              Tax (2.5%): <span>₹{tax.toFixed(2)}</span>
            </h2>
            <hr />
            <h2 className="font-bold flex justify-between">
              Total: <span>₹{total.toFixed(2)}</span>
            </h2>
            <Button className="w-full bg-green-500 text-white flex justify-center items-center gap-2">
              Proceed to Payment <ArrowBigRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

