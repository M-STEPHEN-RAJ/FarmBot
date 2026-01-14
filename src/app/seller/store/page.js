"use client";
import React, { useState, useEffect } from "react";
import AddProductModal from '@/app/components/seller/store/Modal/AddProductModal';
import StoreSidebar from '@/app/components/seller/store/StoreSidebar'

const SellerStore = () => {

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <StoreSidebar />

      <div className="flex-1 overflow-y-auto p-4 pt-14">
        <div className="grid grid-cols-5 gap-y-14 max-w-[1100px] mx-auto">
          <div onClick={() => setShowModal(true)} className="w-[180px] h-[220px] border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer group">
            <div className="w-full h-full flex justify-center items-center">
              <p className='bg-gray-100 group-hover:bg-gray-200 text-4xl font-light px-3 py-1 rounded-full group'>+</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}          
        />
      )}
    </div>
  )
}

export default SellerStore