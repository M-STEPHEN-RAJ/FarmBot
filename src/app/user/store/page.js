import React from 'react'
import StoreSidebar from '@/app/components/store/StoreSidebar';

const Store = () => {
  return (
    <div className="w-full flex">
      <StoreSidebar />

      <div className="flex-1 overflow-y-auto flex justify-center items-center">

        <div className="relative">
          <img src="/images/store/sample_img.png" className='relative w-60 z-10' alt="" />

          <div className="w-45 h-50 absolute top-1/2 left-1/2 -translate-x-1/2 border border-gray-300 pt-18 px-5 rounded-[60px]">
            <div className="">
              <h2 className='text-sm'>Green Grams</h2>
              <p className='text-xs text-gray-400'>Grain</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Store