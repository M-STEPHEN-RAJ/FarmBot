"use client"
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Loading from '../common/Loading';

const Home = () => {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const text = document.querySelector('.circular-text');
    if (!text) return;

    const textContent = text.textContent.trim();
    text.textContent = '';

    const radius = 60;
    const degIncrement = 360 / textContent.length;

    for (let i = 0; i < textContent.length; i++) {
      const char = textContent[i];
      const span = document.createElement('span');
      span.textContent = char;
      const rotate = i * degIncrement;
      span.style.transform = `rotate(${rotate}deg) translate(${radius}px) rotate(${90}deg)`;
      text.appendChild(span);
    }
  }, []);

  const handleGetStartedRedirect = () => {
      setLoading(true);
      router.push('/login');
  }

  return (
    <>
      {loading && <Loading />}
      <div className="relative flex justify-center items-center w-full h-[607px] bg-white">

          <div className="absolute -left-18 top-20">
              <img src="/images/landing/home1-bg.png" alt="" className='w-50' />
          </div>
          <div className="absolute -right-20 -bottom-19">
              <img src="/images/landing/home2-bg.png" alt="" className='w-110' />
          </div>

          <div className="absolute bottom-8 right-120">
            <div className="relative w-[150px] h-[150px] animate-spin-slow">
              <div className="circular-text text-[#1B8841] font-semibold">
                • FARM • INNOVATE • HARVEST 
              </div>
            </div>
          </div>

          <div className="relative flex flex-col justify-start items-start gap-8 z-10 mt-5">
              <h2 className='text-7xl font-normal leading-20'>Smarter Farming Starts Here<br /> with <span className='font-semibold text-[#1B8841]'>FarmBot</span>!</h2>
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