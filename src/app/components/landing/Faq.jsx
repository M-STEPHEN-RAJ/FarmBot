"use client"
import React, { useState } from 'react'

const Faq = () => {

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <div className="relative flex flex-col justify-center items-center w-full h-full bg-white pt-5 pb-20">

        <div className="absolute -left-8 -top-5">
            <img src="/images/landing/faq1-bg.png" alt="" className='w-80' />
        </div>

        <div className="absolute -right-5 top-80">
            <img src="/images/landing/faq2-bg.png" alt="" className='w-70' />
        </div>

        <div className="relative flex flex-col justify-center items-center gap-10 max-w-7xl z-10 py-5">

            <div className="text-center space-y-3">
                <h2 className='font-bold text-3xl'>Frequently Asked<br/> Questions</h2>
                <p className='text-sm font-medium text-gray-500'>If you're new to FarmBot or looking to improve the checkout<br/> experience on your site, this guide will help you learn more about our<br/> platform and it's features.</p>
            </div>

            <div className="space-y-3 w-[900px]">
                <div onClick={() => toggleFAQ(1)} className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-md border border-gray-300 space-y-3 cursor-pointer">
                    <div className="flex justify-between items-center">
                        <h2 className='font-semibold text-lg'>What is FarmBot?</h2> 
                        <div className="p-2 hover:bg-gray-200 rounded-full">
                            <img src="/images/landing/dropdown.png" alt="" className={`w-4 transition-transform duration-300 ${openIndex === 1 ? 'rotate-180' : ''}`} /> 
                        </div>
                    </div>   
                    {openIndex === 1 && (               
                        <p className='text-sm'>FarmBot is an AI-powered farming assistant that automates key farming tasks, helping you monitor crops, detect diseases, recommend fertilizers, and get guidance—all in one platform.</p>
                    )}
                </div>

                <div  onClick={() => toggleFAQ(2)} className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-md border border-gray-300 space-y-3 cursor-pointer">
                    <div className="flex justify-between items-center">
                        <h2 className='font-semibold text-lg'>What is FarmBot?</h2> 
                        <div className="p-2 hover:bg-gray-200 rounded-full cursor-pointer">
                            <img src="/images/landing/dropdown.png" alt="" className={`w-4 transition-transform duration-300 ${openIndex === 2 ? 'rotate-180' : ''}`} /> 
                        </div>
                    </div>                  
                    {openIndex === 2 && (               
                        <p className='text-sm'>FarmBot is an AI-powered farming assistant that automates key farming tasks, helping you monitor crops, detect diseases, recommend fertilizers, and get guidance—all in one platform.</p>
                    )}
                </div>

                <div onClick={() => toggleFAQ(3)} className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-md border border-gray-300 space-y-3 cursor-pointer">
                    <div className="flex justify-between items-center">
                        <h2 className='font-semibold text-lg'>What is FarmBot?</h2> 
                        <div className="p-2 hover:bg-gray-200 rounded-full cursor-pointer">
                            <img src="/images/landing/dropdown.png" alt="" className={`w-4 transition-transform duration-300 ${openIndex === 3 ? 'rotate-180' : ''}`} /> 
                        </div>
                    </div>                  
                    {openIndex === 3 && (               
                        <p className='text-sm'>FarmBot is an AI-powered farming assistant that automates key farming tasks, helping you monitor crops, detect diseases, recommend fertilizers, and get guidance—all in one platform.</p>
                    )}
                </div>

                <div onClick={() => toggleFAQ(4)} className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-md border border-gray-300 space-y-3 cursor-pointer">
                    <div className="flex justify-between items-center">
                        <h2 className='font-semibold text-lg'>What is FarmBot?</h2> 
                        <div className="p-2 hover:bg-gray-200 rounded-full cursor-pointer">
                            <img src="/images/landing/dropdown.png" alt="" className={`w-4 transition-transform duration-300 ${openIndex === 4 ? 'rotate-180' : ''}`} /> 
                        </div>
                    </div>                  
                    {openIndex === 4 && (               
                        <p className='text-sm'>FarmBot is an AI-powered farming assistant that automates key farming tasks, helping you monitor crops, detect diseases, recommend fertilizers, and get guidance—all in one platform.</p>
                    )}
                </div>

                <div onClick={() => toggleFAQ(5)} className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-md border border-gray-300 space-y-3 cursor-pointer">
                    <div className="flex justify-between items-center">
                        <h2 className='font-semibold text-lg'>What is FarmBot?</h2> 
                        <div className="p-2 hover:bg-gray-200 rounded-full cursor-pointer">
                            <img src="/images/landing/dropdown.png" alt="" className={`w-4 transition-transform duration-300 ${openIndex === 5 ? 'rotate-180' : ''}`} /> 
                        </div>
                    </div>                  
                    {openIndex === 5 && (               
                        <p className='text-sm'>FarmBot is an AI-powered farming assistant that automates key farming tasks, helping you monitor crops, detect diseases, recommend fertilizers, and get guidance—all in one platform.</p>
                    )}
                </div>

            </div>

        </div>

    </div>
    </>
  )
}

export default Faq