"use client";
import React, { useState, useRef, useEffect } from "react";

const StoreSidebar = ({ filters, setFilters }) => {

  const range = useRef(null);
  const sortDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(5000);
  const [tempMin, setTempMin] = useState(min);
  const [tempMax, setTempMax] = useState(max);

  const [selectedCategory, setSelectedCategory] = useState("Seeds");
  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Relevance");
  const [openType, setOpenType] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [rating, setRating] = useState(0);

  const categoryOptions = ["Seeds", "Fertilizers", "Tools"];

  const getTypeOptions = (category) => {
    switch (category) {
      case "Seeds":
        return ["Vegetables", "Fruits", "Flowers", "Grains", "Pulses"];
      case "Fertilizers":
        return ["Organic", "Chemical", "Bio-Fertilizers"];
      case "Tools":
        return ["Hand Tools", "Power Tools", "Protective Gear"];
      default:
        return [];
    }
  };

  const sortMap = {
    "Relevance": "popularity",
    "Price: Low → High": "price_low",
    "Price: High → Low": "price_high",
    "Newest First": "newest",
  };
  const sortOptions = Object.keys(sortMap);

  // Handlers
  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setFilters({ ...filters, category: cat });
  };

  const handleTypeSelect = (type) => {
    setOpenType(false);
    setSelectedType(type);
    setFilters({ ...filters, type });
  };

  const handleSortSelect = (label) => {
    setOpenSort(false);
    setSelectedSort(label);
    setFilters({ ...filters, sort: sortMap[label] });
  };
  
  const handleRatingClick = (num) => {
    setRating(num);
    setFilters({ ...filters, rating: num });
  };

  const handleInStock = () => {
    setInStock(!inStock);
    setFilters({ ...filters, inStock: !inStock });
  };

  const handleOutOfStock = () => {
    setOutOfStock(!outOfStock);
    setFilters({ ...filters, outOfStock: !outOfStock });
  };

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), tempMax - 1);
    setTempMin(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), tempMin + 1);
    setTempMax(value);
  };

  const applyPriceFilter = () => {
    setMin(tempMin);
    setMax(tempMax);
    setFilters({ ...filters, minPrice: tempMin, maxPrice: tempMax });
  };

  const getPercent = (value) => Math.round((value / 5000) * 100);

  const handleReset = () => {
    setMin(0);
    setMax(5000);
    setSelectedCategory("Seeds");
    setSelectedType("");
    setSelectedSort("Relevance");
    setRating(0);
    setInStock(false);
    setOutOfStock(false);
    setFilters({
      search: "",
      category: "Seeds",
      type: "",
      minPrice: 0,
      maxPrice: 5000,
      sort: "popularity",
      rating: 0,
      inStock: false,
      outOfStock: false,
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, setFilters]);

  useEffect(() => {
    if (range.current) {
      const minPercent = getPercent(tempMin);
      const maxPercent = getPercent(tempMax);
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [tempMin, tempMax]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target)
      ) {
        setOpenSort(false);
      }
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(e.target)
      ) {
        setOpenType(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-[280px] h-screen overflow-y-auto space-y-4 py-4 border-r border-gray-300">
      <div className="sticky top-0 space-y-4 bg-white pb-3 z-10">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-medium">Farm Store</h2>
          <div className="p-1 hover:bg-gray-100 rounded-md cursor-pointer">
            <img src="/images/chatbot/closepanel.svg" alt="" className="w-5" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-1.5">
          <div className="flex justify-between items-center border border-gray-300 rounded-full pl-3 pr-2 py-1.5">
            <input
              type="text"
              className="w-full text-sm outline-none"
              placeholder={`search for ${selectedCategory}`}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img src="/images/store/search.png" alt="" className="w-5" />
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="px-2 -mt-2">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Category</h3>

        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-[3px] rounded-md text-sm font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#166831] text-white"
                  : "text-green-700 hover:bg-green-50 border border-[#166831]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div className="px-2 mt-5">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{selectedCategory} Type</h3>

        <div ref={typeDropdownRef} className="relative">
          <button
            onClick={() => setOpenType(!openType)}
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm flex justify-between items-center cursor-pointer"
          >
            {selectedType || "All"}
            <img
              src="/images/store/dropdown.png"
              alt=""
              className={`w-4 transition-all duration-200 ${
                openType ? "rotate-180" : ""
              }`}
            />
          </button>

          {openType && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md text-sm z-10">
              <div
                onClick={() => handleTypeSelect("")}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                All
              </div>
              {getTypeOptions(selectedCategory).map((opt) => (
                <div
                  key={opt}
                  onClick={() => handleTypeSelect(opt)}
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
          ₹{tempMin} – ₹{tempMax}
        </p>

        <div className="flex items-center gap-3">
          <div className="relative w-full h-2">
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-gray-300 rounded"></div>

            <div
              ref={range}
              className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#166831] rounded"
              style={{
                left: `${getPercent(min)}%`,
                width: `${getPercent(max) - getPercent(min)}%`,
              }}
            ></div>

            <input
              type="range"
              min="0"
              max="5000"
              value={tempMin}
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
              value={tempMax}
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

          <button 
            onClick={applyPriceFilter}
            className="px-4 py-1 text-sm border rounded-full hover:bg-gray-100 cursor-pointer"
          >
            Go
          </button>
        </div>
      </div>

      {/* Availaibility */}
      <div className="px-1.5">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Availability</h3>

        <div className="flex flex-col gap-2">
          <label className="w-fit flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={inStock}
              onChange={handleInStock}
              className="accent-[#166831]"
            />
            In Stock
          </label>
          <label className="w-fit flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={outOfStock}
              onChange={handleOutOfStock}
              className="accent-[#166831]"
            />
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
            <img
              src="/images/store/dropdown.png"
              alt=""
              className={`w-4 transition-all duration-200 ${
                openSort ? "rotate-180" : ""
              }`}
            />
          </button>

          {openSort && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md text-sm">
              {sortOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => handleSortSelect(opt)}
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
              <img
                onClick={() => handleRatingClick(num)}
                key={num}
                src={
                  num <= rating
                    ? "/images/store/star-active.png"
                    : "/images/store/star.png"
                }
                alt=""
                className="w-6 cursor-pointer"
              />
            ))}
          </div>

          {rating != 0 && (
            <button
              onClick={() => handleRatingClick(0)}
              className="px-2 text-red-500 text-xs font-medium hover:text-red-600 cursor-pointer"
            >
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
