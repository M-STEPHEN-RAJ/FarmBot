"use client";
import React, { useState, useEffect } from "react";
import StoreSidebar from "@/app/components/store/StoreSidebar";
import axios from "axios";
import { API } from "@/app/utils/api";

const Store = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    category: "Seeds",
    type: "",
    minPrice: 0,
    maxPrice: 5000,
    rating: 0,
    inStock: false,
    outOfStock: false,
    sort: "popularity",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(filters).toString();
        const { data } = await axios.get(`${API}/store/products?${query}`);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [filters]);

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <StoreSidebar filters={filters} setFilters={setFilters} />

      <div className="flex-1 overflow-y-auto p-4 pt-14">
        <div className="grid grid-cols-5 gap-y-14 max-w-[1100px] mx-auto">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative w-[180px] h-[220px] border border-gray-300 rounded-xl px-2"
            >
              <img
                className="absolute -top-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 w-60 h-30 z-10 object-contain rounded-full"
                src={product.image}
                alt=""
              />

              <div className="mt-17 space-y-3">
                <div>
                  <h2 className="text-sm font-medium">{product.name}</h2>
                  <p className="text-xs text-gray-400">{product.type}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <img 
                        key={num}
                        src={
                          num <= product.rating
                            ? "/images/store/star-active.png"
                            : "/images/store/star.png"
                        }
                        className="w-4"
                        alt=""
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500">{product.reviewCount} reviews</p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">
                    ₹ {product.price}
                    <span className="text-xs text-gray-600">/{product.unit}</span>
                  </p>

                  <div className="flex items-center gap-3">
                    <button className="h-5 w-5 text-red-500 bg-red-50 rounded-full cursor-pointer">
                      −
                    </button>
                    <p className="text-sm">1</p>
                    <button className="h-5 w-5 text-green-500 bg-green-50 rounded-full cursor-pointer">
                      +
                    </button>
                  </div>
                </div>

                <button className="w-full py-1.5 text-sm text-white bg-[#166831] rounded-md cursor-pointer mt-1">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;
