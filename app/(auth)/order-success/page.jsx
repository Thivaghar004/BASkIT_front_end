"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function OrderSuccess() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState(null)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Fetch order details from sessionStorage or API
    const details = JSON.parse(sessionStorage.getItem("lastOrderDetails") || "{}")
    console.log(details); // Check the details in the console
    setOrderDetails(details)

    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (countdown === 0) {
      router.push("/")
    }
  }, [countdown, router])

  if (!orderDetails) {
    return <div>Loading order details...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Order Placed Successfully!</h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Order ID:</strong>
          </p>
          <p>{orderDetails.orderId}</p>
          <p>
            <strong>Total Amount:</strong>
          </p>
          <p>₹{orderDetails.totalAmount.toFixed(2)}</p>
          <p>
            <strong>Payment Method:</strong>
          </p>
          <p>{orderDetails.paymentMethod}</p>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-2">Shipping Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Name:</strong>
          </p>
          <p>{orderDetails.name}</p>
          <p>
            <strong>Address:</strong>
          </p>
          <p>{orderDetails.address}</p>
          <p>
            <strong>Phone:</strong>
          </p>
          <p>{orderDetails.phoneNumber}</p>
        </div>
        <div className="mt-8 text-center">
          <p>Redirecting to home page in {countdown} seconds</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

