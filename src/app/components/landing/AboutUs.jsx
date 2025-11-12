import React from 'react'

const AboutUs = () => {
  return (
    <>
    <div className="relative flex justify-center items-center w-full h-full bg-white pb-5 pt-10">

        <div className="relative flex flex-col justify-center gap-10 max-w-7xl z-10 py-5">
            <div className="text-center space-y-2">
                <h3 className='text-3xl font-bold'>Build on Experience. Driven by Quality</h3>
                <p className='text-sm font-medium text-gray-500'>with over 15 years in the industry, we bring a hands-on, client-first approach<br /> to every project. Our team blends craftmanship, innovation, and trust to<br /> deliver excellence.</p>
            </div>

            <div className="grid grid-cols-3 grid-rows-7 gap-2 h-[370px] w-[1150px] mx-auto">

                {/* Card 1 */}
                <div className="relative bg-[#1B8841] col-span-1 row-span-7 pl-6 py-2 rounded-tr-md rounded-bl-md [clip-path:polygon(32px_0,100%_0,100%_calc(100%-32px),calc(100%-32px)_100%,0_100%,0_32px)]">
                    <div className="absolute top-3 -right-15.5">
                        <img src="/images/landing/aboutus-bg.png" alt="" className='w-50' />
                    </div>        
                    <div className="absolute bottom-3 right-1.5">
                        <img src="/images/landing/aboutus-bg.png" alt="" className='w-50' />
                    </div>     

                    <div className="relative text-white space-y-8 px-3 py-3 z-10">
                        <h2 className='text-xl font-semibold'>Our Vision</h2>
                        <p className='text-sm'>FarmBot aims to transform traditional farming into a smart, data-driven experience using AI and automation.</p>
                    </div>   

                    <div className="relative text-white space-y-5 px-3 py-3 z-10">
                        <h2 className='text-xl font-semibold'>Our Mission</h2>
                        <p className='text-sm'>Empower farmers with AI tools that simplify decision-making and increase productivity.</p>
                    </div>          
                </div>

                {/* Card 2 */} 
                <div className="relative bg-[#1B8841] row-span-3 pl-6 py-4 border border-gray-300 [clip-path:polygon(0_0,calc(100%-32px)_0,100%_32px,100%_100%,32px_100%,0_calc(100%-32px))]">
                    <div className="absolute top-3 -right-5">
                        <img src="/images/landing/aboutus-bg.png" alt="" className='w-40' />
                    </div>

                    <div className="relative text-white space-y-4.5 pl-3 z-10">
                        <h2 className='text-xl font-semibold'>Smart Crop</h2>
                        <p className='text-sm'>FarmBot aims to transform traditional farming into a smart, data-driven experience using AI and automation.</p>
                    </div>                             
                </div>

                {/* Card 3*/}
                <div className="relative bg-[#1B8841] pl-8 py-4 row-span-4 border border-gray-300 [clip-path:polygon(0_0,calc(100%-32px)_0,100%_32px,100%_100%,32px_100%,0_calc(100%-32px))]">
                    <div className="absolute top-3 -right-5">
                        <img src="/images/landing/aboutus-bg.png" alt="" className='w-40' />
                    </div> 

                    <div className="relative text-white space-y-5 z-10">
                        <h2 className='text-xl font-semibold'>Plant Disease<br /> Detection</h2>
                        <p className='text-sm'>FarmBot aims to transform traditional farming into a smart, data-driven experience using AI and automation.</p>
                    </div>    
                </div>

                {/* Card 4 */}
                <div className="relative bg-[#1B8841] pl-8 py-4 row-span-4 border border-gray-300 [clip-path:polygon(32px_0,100%_0,100%_calc(100%-32px),calc(100%-32px)_100%,0_100%,0_32px)]">
                    <div className="absolute top-3 -right-6">
                        <img src="/images/landing/aboutus-bg.png" alt="" className='w-40' />
                    </div> 

                    <div className="relative text-white space-y-7 z-10">
                        <h2 className='text-xl font-semibold'>FarmBot AI<br /> Chat Assistant</h2>
                        <p className='text-sm'>FarmBot aims to transform traditional farming into a smart, data-driven experience using AI and automation.</p>
                    </div> 
                </div>

                {/* Card 5 */}
                <div className="relative bg-[#1B8841] pl-8 py-4 border row-span-3 border-gray-300 [clip-path:polygon(32px_0,100%_0,100%_calc(100%-32px),calc(100%-32px)_100%,0_100%,0_32px)]">
                    <div className="absolute top-3 -right-2">
                        <img src="/images/landing/aboutus-bg.png" alt="" className='w-40' />
                    </div> 

                    <div className="relative text-white space-y-4.5 z-10">
                        <h2 className='text-xl font-semibold'>Farmer-Friendly</h2>
                        <p className='text-sm'>FarmBot aims to transform traditional farming into a smart, data-driven experience using AI and automation.</p>
                    </div>
                </div>
                
            </div>
        </div>

    </div>
    </>
  )
}

export default AboutUs