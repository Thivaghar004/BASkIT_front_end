"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      if (res.status === 200 && res.data.userId) {
        const {userId, name, email, locationId, address } = res.data;
        sessionStorage.setItem("user", JSON.stringify({userId, name, email, locationId, address }));

        toast.success("Login Successful");
        router.push("/");
      }
    } catch (err) {
      toast.error("Invalid Credentials or User Not Found");
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
        <h2 className="text-center text-2xl font-bold text-gray-700">Login</h2>
        <hr className="my-4" />

        <form onSubmit={handleLogin}>
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

          <button
            type="submit"
            className={`w-full p-2 text-white rounded ${loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-3 text-center text-gray-600">
            <p>
              Don't have an account?{" "}
              <a href="/register" className="text-green-600 hover:underline">
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
