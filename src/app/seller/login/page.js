"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API } from "@/app/utils/api";
import SellerLoading from "@/app/components/common/SellerLoading";

const SellerLogin = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      return toast.error("Please fill in all fields!");
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/seller/login`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        localStorage.setItem("seller-session-change", Date.now());
        toast.success(res.data.message || "Login successful!");
        router.push("/seller/store");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Invalid credentials!");
      } else if (err.response?.status === 404) {
        toast.error("Seller not found!");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    setLoading(true);
    router.push("/seller/register");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <>
      {loading && <SellerLoading />}
      <div className="flex w-screen h-screen overflow-hidden">
        {/* Left Side */}
        <div className="bg-white w-1/2 h-full flex flex-col justify-center items-center">
          <div className="space-y-8 min-w-[450px]">
            <div className="">
              <h2 className="text-2xl font-semibold">Welcome Back!</h2>
            </div>

            {/* <div className="space-y-5">
              <div className="flex justify-center items-center gap-5 rounded-md py-2.5 border border-gray-300 cursor-pointer">
                <img
                  src="/images/seller/login/google.png"
                  alt=""
                  className="w-5"
                />
                <p>Continue with Google</p>
              </div>
              <div className="flex justify-center items-center gap-5">
                <div className="w-full h-0.5 border-t border-t-gray-300"></div>
                <p>or</p>
                <div className="w-full h-0.5 border-t border-gray-300"></div>
              </div>
            </div> */}

            <div className="space-y-5 mt-12">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium text-gray-500"
                  htmlFor="email"
                >
                  Your Email
                </label>
                <input
                  className="px-3 py-2 border border-gray-300 rounded-md outline-none"
                  placeholder="example@gmail.com"
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium text-gray-500"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="px-3 py-2 border border-gray-300 rounded-md outline-none"
                  placeholder="Enter your password"
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
                <p className="text-right text-sm text-[#EB3D3F] font-semibold cursor-pointer mt-1">
                  Forgot Password?
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleLogin}
                className="w-full bg-[#F57627] font-medium text-white py-1.5 rounded-md cursor-pointer"
              >
                Login
              </button>

              <p className="text-sm text-center">
                Don't have an account?{" "}
                <span
                  onClick={handleRegisterRedirect}
                  className="text-[#EB3D3F] font-semibold cursor-pointer"
                >
                  Register
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Theme */}
        <div className="relative w-1/2 h-full bg-[#F57627]">
          <div className="absolute top-0 -left-0.5">
            <img
              src="/images/seller/login/login-1.png"
              alt=""
              className="w-[200px] h-auto"
            />
          </div>
          <div className="absolute -bottom-6.5 right-0">
            <img
              src="/images/seller/login/login-2.png"
              alt=""
              className="w-[280px] h-auto"
            />
          </div>
          <div className="flex items-center absolute top-5 right-5">
            <img
              src="/images/seller/login/logo.png"
              alt=""
              className="w-20 h-auto"
            />
            <h2 className="text-white text-xl font-semibold">FarmBot</h2>
          </div>

          <div className="relative w-full h-full z-10">
            <div className="w-full h-full flex flex-col justify-center items-center -mt-7">
              <img
                src="/images/seller/login/login-bg.png"
                alt=""
                className="w-[350px] h-auto"
              />
              <div className="flex flex-col justify-center items-center gap-5">
                <h2 className="text-xl text-white font-semibold">
                  Farm Smarter, Not Harder
                </h2>
                <p className="w-[70%] text-base text-gray-200 text-center">
                  FarmBot automates your farming tasks, helping you grow more
                  efficiently with precision and care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerLogin;
