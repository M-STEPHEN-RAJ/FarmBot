"use client"
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Sidebar = () => {

  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route) => pathname.startsWith(route);

  return (
    <>
    <div className="h-[calc(100vh-8px)] flex flex-col justify-between items-center p-2 border border-gray-300 rounded-md">

        <div className="flex flex-col gap-3 items-center">
          <div className="w-10 h-10 flex justify-center items-center border border-gray-300 rounded-md">
            <img src="/images/sidebar/logo.png" alt="" className='w-10' />
          </div>

          <div className="space-y-1">
            <div className={`p-2 ${isActive("/user/dashboard") ? 'bg-gray-300 hover:bg-gray-400' : 'hover:bg-gray-100'} rounded-md cursor-pointer group relative`}>
              <img src="/images/sidebar/dashboard.png" alt="" className='w-6' />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                Dashboard
              </div>
            </div>

            <div 
              onClick={() => router.push('/user/store')}
              className={`p-2 ${isActive("/user/store") ? 'bg-gray-100 hover:bg-gray-200' : 'hover:bg-gray-100'} rounded-md cursor-pointer group relative`}
            >
              <img src="/images/sidebar/farmstore.png" alt="" className='w-6' />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                Farm Store
              </div>
            </div>

            <div className={`p-2 ${isActive("/user/crop-recommendation") ? 'bg-gray-300 hover:bg-gray-400' : 'hover:bg-gray-100'} rounded-md cursor-pointer group relative`}>
              <img src="/images/sidebar/farmguide.png" alt="" className='w-6' />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                Farm Guide
              </div>
            </div>

            <div className={`p-2 ${isActive("/user/plant-disease-detection") ? 'bg-gray-300 hover:bg-gray-400' : 'hover:bg-gray-100'} rounded-md cursor-pointer group relative`}>
              <img src="/images/sidebar/farmdoc.png" alt="" className='w-6' />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                Farm Doc
              </div>
            </div>

            <div 
              onClick={() => router.push('/user/chatbot')}
              className={`p-2 ${isActive("/user/chatbot") ? 'bg-gray-100 hover:bg-gray-200' : 'hover:bg-gray-100'} rounded-md cursor-pointer group relative`}
            >
              <img src="/images/sidebar/chatbot.png" alt="" className='w-6' />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                Farm AI
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className={`p-2 ${isActive("/user/notification") ? 'bg-gray-200 hover:bg-gray-300' : 'hover:bg-gray-100'} rounded-md cursor-pointer group relative`}>
            <span className='w-4 h-4 absolute top-1 right-1 flex justify-center items-center text-xs text-white bg-[#1B8841] rounded-full'>3</span>
            <img src="/images/sidebar/notification.png" alt="" className='w-6' />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
              Notification
            </div>
          </div>

          <div 
            onClick={() => router.push('/user/settings')} 
            className={`p-2 ${isActive("/user/settings") ? 'bg-gray-200 hover:bg-gray-300' : 'hover:bg-gray-100'} rounded-md cursor-pointer group relative`}
          >
            <img src="/images/sidebar/settings.png" alt="" className='w-6' />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
              Settings
            </div>
          </div>

          <div className="hover:bg-gray-300 rounded-full cursor-pointer">
            <img src="/images/sidebar/avatar.jpg" alt="" className='p-1 w-10 rounded-full' />
          </div>
        </div>

    </div>
    </>
  )
}

export default Sidebar