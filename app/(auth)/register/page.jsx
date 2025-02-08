"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(event) {
    event.preventDefault();

    if (!name || !email || !password || !phoneNumber || !address || !location) {
      toast.error("Please fill all fields!");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        name,
        email,
        password,
        phoneNo: phoneNumber,
        address,
        location: { locationId: location },
      });

      if (response.status === 201) {
        toast.success("Registration Successful");
        router.push("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="Logo" width={50} height={100} />
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-700">User Registration</h2>
        <hr className="my-4" />

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-semibold">Name</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-green-400"
              placeholder="Enter Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-semibold">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-green-400"
              placeholder="Enter Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-green-400 pr-10"
                placeholder="Enter Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-semibold">Phone Number</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-green-400"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-semibold">Address</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-green-400"
              placeholder="Enter Address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-semibold">Pincode</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-green-400"
              placeholder="Enter Pincode"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full p-2 text-white rounded ${loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="mt-3 text-center text-gray-600">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-green-600 hover:underline">
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
