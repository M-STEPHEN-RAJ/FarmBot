"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Loading from './Loading';

const Home = () => {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleGetStartedRedirect = () => {
      setLoading(true);
      router.push('/login');
  }

  return (
    <>
      {loading && <Loading />}
      <div className="relative flex justify-center items-center w-full h-[607px] bg-white">

          <div className="absolute -left-15 top-20">
              <img src="/images/landing/home1-bg.png" alt="" className='w-50' />
          </div>
          <div className="absolute -right-20 -bottom-19">
              <img src="/images/landing/home2-bg.png" alt="" className='w-110' />
          </div>

          <div className="relative flex flex-col gap-8 max-w-7xl z-10">
              <h2 className='text-[65px] font-normal leading-18'>Smarter Farming Starts Here<br /> with <span className='font-semibold text-[#1B8841]'>FarmBot</span>!</h2>
              <p className='text-gray-500'>Harness the power of Artificial Intelligence to boost your<br /> farm’s productivity, health, and sustainability all in one intelligent platform.</p>
              <div className="flex items-center gap-10">
                <p className='px-5 py-2.5 font-medium bg-[#1B8841] text-white rounded-full cursor-pointer'>Learn more</p>                            
                <div onClick={handleGetStartedRedirect} className="w-fit flex items-center gap-3 hover:gap-5 pl-5 pr-1.5 py-1.5 rounded-full bg-white hover:bg-[#1B8841] text-[#1B8841] hover:text-white border border-[#1B8841] transition-all duration-300 cursor-pointer">
                  <p className='font-medium'> 
                    Get Started
                  </p>
                  <div className="p-1.5 bg-[#1B8841] rounded-full">
                    <img src="/images/landing/right-arrow.png" alt="" className='w-5' />
                  </div>
                </div>              
              </div>
          </div>
      </div>
    </>
  )
}

export default Home