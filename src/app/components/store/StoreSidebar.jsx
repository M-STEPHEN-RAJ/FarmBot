"use client";
import React, { useState, useRef, useEffect } from "react";

const StoreSidebar = () => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(5000);
  const range = useRef(null);

  const getPercent = (value) => Math.round((value / 5000) * 100);

  useEffect(() => {
    if (range.current) {
      const minPercent = getPercent(min);
      const maxPercent = getPercent(max);
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [min, max]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), max - 1);
    setMin(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), min + 1);
    setMax(value);
  };

  return (
    <div className="w-[280px] h-screen space-y-3 py-4 border-r border-gray-300">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-medium">Farm Store</h2>
        <div className="p-1 hover:bg-gray-100 rounded-md cursor-pointer">
          <img
            src="/images/chatbot/closepanel.svg"
            alt=""
            className="w-5"
          />
        </div>
      </div>

      <div className="px-1.5">
        <div className="flex justify-between items-center border border-gray-300 rounded-full pl-3 pr-2 py-1.5">
          <input type="text" className='w-full text-sm outline-none' placeholder='search for seeds' />          
          <img src="/images/store/search.png" alt="" className='w-5' />          
        </div>
      </div>

      <div className="px-2 space-y-0.5">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Price</h3>

        <p className="font-medium text-sm">
          ₹{min} – ₹{max}
        </p>

        <div className="flex items-center gap-3">

          <div className="relative w-full h-2">

            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-gray-300 rounded"></div>

            <div
              ref={range}
              className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#166831] rounded"
              style={{ left: `${getPercent(min)}%`, width: `${getPercent(max) - getPercent(min)}%` }}
            ></div>

            <input
              type="range"
              min="0"
              max="5000"
              value={min}
              onChange={handleMinChange}
              className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer
              [&::-webkit-slider-thumb]:pointer-events-auto
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:bg-[#166831]
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:shadow-md
              "
            />

            <input
              type="range"
              min="0"
              max="5000"
              value={max}
              onChange={handleMaxChange}
              className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer
              [&::-webkit-slider-thumb]:pointer-events-auto
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:bg-[#166831]
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:shadow-md
              "
            />
          </div>

          <button className="px-4 py-1 text-sm border rounded-full hover:bg-gray-100 cursor-pointer">
            Go
          </button>
        </div>
      </div>

      <div className="px-1.5">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Availability</h3>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="accent-[#166831]" />
            In Stock
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="accent-[#166831]" />
            Out of Stock
          </label>
        </div>
      </div>

    </div>
  );
};

export default StoreSidebar;
