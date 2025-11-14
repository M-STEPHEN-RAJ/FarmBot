"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { signIn } from "next-auth/react";
import Loading from '../components/common/Loading';

const register = () => {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleRegister = async () => {
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Please fill in all fields!");
        setLoading(false);
        return;
      }

      const { data } = await axios.post("/api/auth/register", formData);
      toast.success(data.message);
      router.push("/login");
    }
    catch (error) {
      if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message);
      }
      else {
        toast.error("Something went wrong!");
      }
    }
    finally{
      setLoading(false);
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/user/chatbot" });
  };

  const handleLoginRedirect = () => {
    setLoading(true);
    router.push('/login');
  }

  return (
    <>
    { loading && <Loading /> }
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Left Side */}
      <div className="bg-white w-1/2 h-full flex flex-col justify-center items-center">
        
        <div className="space-y-8 min-w-[450px]">

          <div className="">
            <h2 className='text-2xl font-semibold'>Create your Account</h2>
          </div>

          <div className="space-y-5">
            <div onClick={handleGoogleSignUp} className="flex justify-center items-center gap-5 rounded-md py-2.5 border border-gray-300 cursor-pointer">
              <img src="/images/login/google.png" alt="" className='w-5' />
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
              <label className='text-sm font-medium text-gray-500' htmlFor="name">Your Name</label>
              <input 
                className='px-3 py-2 border border-gray-300 rounded-md outline-none' 
                name="name"
                id='name' 
                placeholder='Enter your name' 
                type="text" 
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className='text-sm font-medium text-gray-500' htmlFor="email">Your Email</label>
              <input 
                className='px-3 py-2 border border-gray-300 rounded-md outline-none' 
                name="email" 
                id='email' 
                placeholder='example@gmail.com' 
                type="email" 
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className='text-sm font-medium text-gray-500' htmlFor="password">Password</label>
              <input 
                className='px-3 py-2 border border-gray-300 rounded-md outline-none' 
                name="password"
                id='password' 
                placeholder='Enter your password' 
                type="password" 
                value={formData.password}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="space-y-4">
            <button onClick={handleRegister} className='w-full bg-[#166831] font-medium text-white py-1.5 rounded-md cursor-pointer'>
              Register
            </button>

            <p className='text-sm text-center'>Already have an Account? <span onClick={handleLoginRedirect} className='text-[#166831] font-semibold cursor-pointer'>Login</span></p>
          </div>

        </div>

      </div>

      {/* Right Theme */}
      <div className="relative w-1/2 h-full bg-[#166831]">

        <div className="absolute top-0 -left-0.5">
          <img src="/images/login/login-1.png" alt="" className="w-[200px] h-auto" />

        </div>
        <div className="absolute -bottom-6.5 right-0">
          <img src="/images/login/login-2.png" alt="" className="w-[280px] h-auto" />
        </div>
        <div className="flex items-center absolute top-5 right-5">
          <img src="/images/login/logo.png" alt="" className="w-20 h-auto" />
          <h2 className='text-white text-xl font-semibold'>FarmBot</h2>
        </div>

        <div className="relative w-full h-full z-10">

          <div className="w-full h-full flex flex-col justify-center items-center -mt-7">
            <img src="/images/login/login-bg.png" alt="" className="w-[450px] h-auto" />
            <div className="flex flex-col justify-center items-center gap-5">
              <h2 className='text-xl text-white font-semibold'>Farm Smarter, Not Harder</h2>
              <p className='w-[70%] text-base text-gray-200 text-center'>FarmBot automates your farming tasks, helping you grow more efficiently with precision and care.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
    </>
  )
}

export default register