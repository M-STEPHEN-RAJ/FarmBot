import React from 'react'

const Footer = () => {
  return (
    <>
    <div className="relative flex flex-col justify-center items-center w-full h-full bg-[#166831] py-5">

        <div className="absolute right-0 bottom-0">
            <img src="/images/landing/footer-bg.png" alt="" className='w-100' />
        </div>

        <div className="relative flex justify-center gap-25 max-w-7xl z-10 py-5">
            {/* Left Side */}
            <div className="w-1/2 space-y-8">

                <div className="space-y-2">
                    <div className="flex items-center">
                        <img src="/images/landing/logo.png" alt="" className='w-15' />
                        <h2 className='text-white text-xl font-semibold'>FarmBot</h2>
                    </div>

                    <div className="">
                        <p className='text-white text-sm'>FarmBot automates your farming tasks, helping you grow crops more efficiently and sustainably. With smart tools for crop monitoring, fertilizer suggestions, and disease detection, it makes modern farming easier and more productive.</p>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <div className="p-2 transition-all duration-200 hover:bg-white/10 rounded-full cursor-pointer">
                        <img src="/images/landing/linkedin.png" alt="" className='w-7' />
                    </div>
                    <div className="p-2 transition-all duration-200 hover:bg-white/10 rounded-full cursor-pointer">
                        <img src="/images/landing/twitter.png" alt="" className='w-7' />
                    </div>
                    <div className="p-2 transition-all duration-200 hover:bg-white/10 rounded-full cursor-pointer">
                        <img src="/images/landing/instagram.png" alt="" className='w-7' />
                    </div>
                    <div className="p-2 transition-all duration-200 hover:bg-white/10 rounded-full cursor-pointer">
                        <img src="/images/landing/facebook.png" alt="" className='w-7' />
                    </div>
                </div>

            </div>
            {/* Right Side */}
            <div className="flex justify-center items-center">

                <div className="flex gap-18 py-1.5">
                    <div className="text-green-200 text-sm space-y-3 font-light">
                        <p className='text-white text-base font-semibold mb-5'>Menu</p>
                        <p className='w-fit hover:text-white hover:font-normal transition-all duration-200 transform hover:scale-101 cursor-pointer'>Home</p>
                        <p className='w-fit hover:text-white hover:font-normal transition-all duration-200 transform hover:scale-101 cursor-pointer'>About</p>
                        <p className='w-fit hover:text-white hover:font-normal transition-all duration-200 transform hover:scale-101 cursor-pointer'>Team</p>
                        <p className='w-fit hover:text-white hover:font-normal transition-all duration-200 transform hover:scale-101 cursor-pointer'>FAQ</p>
                    </div>

                    <div className="w-41.5 text-green-200 text-sm space-y-3 font-light">
                        <p className='font-semibold text-white mb-6'>Services</p>
                        <p className='w-fit hover:text-white hover:font-normal transition-all duration-200 transform hover:scale-101 cursor-pointer'>Seed Store</p>
                        <p className='w-fit hover:text-white hover:font-normal transition-all duration-200 transform hover:scale-101 cursor-pointer'>Crop Recommendation</p>
                        <p className='w-fit hover:text-white hover:font-normal transition-all duration-200 transform hover:scale-101 cursor-pointer'>Plant Disease Detection</p>
                        <p className='w-fit hover:text-white hover:font-normal transition-all duration-200 transform hover:scale-101 cursor-pointer'>Fertilizer Suggestion</p>
                        <p className='w-fit hover:text-white hover:font-normal transition-all duration-200 transform hover:scale-101 cursor-pointer'>FarmBot Chat Assistant</p>
                    </div>

                    <div className="text-white text-sm space-y-6">
                        <p className='font-semibold'>Contact Us</p>
                        <button className='px-5 py-2 rounded-md bg-[#1B8841]/80 hover:bg-[#1B8841] transition-all duration-300 cursor-pointer'>Get in touch</button>
                    </div>
                </div>
                
            </div>

        </div>

        <div className="py-5">
            <p className='text-sm text-white'>&copy; {new Date().getFullYear()} FarmBot. All rights reserved.</p>
        </div>

    </div>
    </>
  )
}

export default Footer