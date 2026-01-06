"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import Loading from "../../components/common/Loading";
import { API } from "../../utils/api";

const Login = () => {
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
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields!");
        setLoading(false);
        return;
      }

      const res = await axios.post(`${API}/auth/login`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      if (res.status === 200) {
        localStorage.setItem("session-change", Date.now());
        toast.success("Login successful!");

        setLoading(false);
        router.push("/user/chatbot");
        return;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Invalid credentials!");
      } else if (error.response?.status === 404) {
        toast.error("User not found!");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/user/chatbot" });
    localStorage.setItem("session-change", Date.now());
  };

  const handleRegisterRedirect = () => {
    setLoading(true);
    router.push("/user/register");
  };

  return (
    <>
      {loading && <Loading />}
      <div className="flex w-screen h-screen overflow-hidden">
        {/* Left Side */}
        <div className="bg-white w-1/2 h-full flex flex-col justify-center items-center">
          <div className="space-y-8 min-w-[450px]">
            <div className="">
              <h2 className="text-2xl font-semibold">Welcome Back!</h2>
            </div>

            <div className="space-y-5">
              <div
                onClick={handleGoogleSignIn}
                className="flex justify-center items-center gap-5 rounded-md py-2.5 border border-gray-300 cursor-pointer"
              >
                <img src="/images/user/login/google.png" alt="" className="w-5" />
                <p>Continue with Google</p>
              </div>
              <div className="flex justify-center items-center gap-5">
                <div className="w-full h-0.5 border-t border-t-gray-300"></div>
                <p>or</p>
                <div className="w-full h-0.5 border-t border-gray-300"></div>
              </div>
            </div>

            <div className="space-y-5 -mt-3">
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
                />
                <p className="text-right text-sm text-[#166831] font-semibold cursor-pointer mt-1">
                  Forgot Password?
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleLogin}
                className="w-full bg-[#166831] font-medium text-white py-1.5 rounded-md cursor-pointer"
              >
                Login
              </button>

              <p className="text-sm text-center">
                Don't have an account?{" "}
                <span
                  onClick={handleRegisterRedirect}
                  className="text-[#166831] font-semibold cursor-pointer"
                >
                  Register
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Theme */}
        <div className="relative w-1/2 h-full bg-[#166831]">
          <div className="absolute top-0 -left-0.5">
            <img
              src="/images/user/login/login-1.png"
              alt=""
              className="w-[200px] h-auto"
            />
          </div>
          <div className="absolute -bottom-6.5 right-0">
            <img
              src="/images/user/login/login-2.png"
              alt=""
              className="w-[280px] h-auto"
            />
          </div>
          <div className="flex items-center absolute top-5 right-5">
            <img src="/images/user/login/logo.png" alt="" className="w-20 h-auto" />
            <h2 className="text-white text-xl font-semibold">FarmBot</h2>
          </div>

          <div className="relative w-full h-full z-10">
            <div className="w-full h-full flex flex-col justify-center items-center -mt-7">
              <img
                src="/images/user/login/login-bg.png"
                alt=""
                className="w-[450px] h-auto"
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

export default Login;
