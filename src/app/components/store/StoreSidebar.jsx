"use client";
import React, { useState, useRef, useEffect } from "react";

const StoreSidebar = () => {

  const range = useRef(null);  
  const sortDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(5000);

  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Relevance");
  const [openType, setOpenType] = useState(false);  
  const [selectedType, setSelectedType] = useState("All Seeds");
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);

  const [rating, setRating] = useState(4);

  const typeOptions = [
    "Vegetables",
    "Fruits",
    "Flowers",
    "Grains",
    "Pulses"
  ];

  const sortOptions = [
    "Relevance",
    "Price: Low → High",
    "Price: High → Low",
    "Newest First",
  ];

  const getPercent = (value) => Math.round((value / 5000) * 100);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), max - 1);
    setMin(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), min + 1);
    setMax(value);
  };

  const handleReset = () => {
    setMin(0);
    setMax(5000);
    setSelectedType("All Seeds");
    setSelectedSort("Relevance");
    setRating(0);
    setInStock(false);
    setOutOfStock(false);
  };

  useEffect(() => {
    if (range.current) {
      const minPercent = getPercent(min);
      const maxPercent = getPercent(max);
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [min, max]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setOpenSort(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target)) {
        setOpenType(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-[280px] h-screen overflow-y-auto space-y-4 py-4 border-r border-gray-300">

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

      {/* Search Bar */}
      <div className="px-1.5">
        <div className="flex justify-between items-center border border-gray-300 rounded-full pl-3 pr-2 py-1.5">
          <input type="text" className='w-full text-sm outline-none' placeholder='search for seeds' />          
          <img src="/images/store/search.png" alt="" className='w-5' />          
        </div>
      </div>

      {/* Type */}
      <div className="px-2 mt-5">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Seed Type</h3>

        <div ref={typeDropdownRef} className="relative">
          <button
            onClick={() => setOpenType(!openType)}
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm flex justify-between items-center cursor-pointer"
          >
            {selectedType}
            <img src="/images/store/dropdown.png" alt="" className={`w-4 transition-all duration-200 ${openType ? 'rotate-180' : ''}`} />
          </button>

          {openType && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md text-sm z-10">
              {typeOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setSelectedType(opt);
                    setOpenType(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="px-2">
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

      {/* Availaibility */}
      <div className="px-1.5">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Availability</h3>

        <div className="flex flex-col gap-2">
          <label className="w-fit flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={inStock} onChange={() => setInStock(!inStock)} className="accent-[#166831]" />
            In Stock
          </label>
          <label className="w-fit flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={outOfStock} onChange={() => setOutOfStock(!outOfStock)} className="accent-[#166831]" />
            Out of Stock
          </label>
        </div>
      </div>

      {/* Sort by */}
      <div className="px-1.5">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Sort By</h3>

        <div ref={sortDropdownRef} className="relative">
          <button
            onClick={() => setOpenSort(!openSort)}
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm flex justify-between items-center cursor-pointer"
          >
            {selectedSort}
            <img src="/images/store/dropdown.png" alt="" className={`w-4 transition-all duration-200 ${openSort ? 'rotate-180' : ''}`} />
          </button>

          {openSort && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md text-sm">
              {sortOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setSelectedSort(opt);
                    setOpenSort(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="px-1.5">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Rating</h3>

        <div className="flex justify-between items-center">

          <div className="flex flex-row-reverse justify-end">
            {[5, 4, 3, 2, 1].map((num) => (
              <img onClick={() => setRating(num)} key={num} src={num <= rating ? "/images/store/star-active.png" : "/images/store/star.png"} alt="" className="w-6 cursor-pointer" />
            ))}
          </div>

          {rating != 0 && (
            <button onClick={() => setRating(0)} className="px-2 text-red-500 text-xs font-medium hover:text-red-600 cursor-pointer">
              Clear
            </button>
          )}

        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button 
          onClick={handleReset}
          className="w-1/2 p-1 text-sm font-medium text-[#166831] border border-[#166831] hover:text-white hover:bg-[#166831] rounded-full cursor-pointer"
        >
          Reset
        </button>
      </div>

    </div>
  );
};

export default StoreSidebar;