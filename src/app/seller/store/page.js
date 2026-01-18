"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { gsap } from "gsap";
import { API } from "@/app/utils/api";
import toast from "react-hot-toast";
import AddProductModal from "@/app/components/seller/store/Modal/AddProductModal";
import StoreSidebar from "@/app/components/seller/store/StoreSidebar";

const SellerStore = () => {
  const router = useRouter();
  const productsRef = useRef([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [quantities, setQuantities] = useState({});

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
    status: "active",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(filters).toString();
        const { data } = await axios.get(`${API}/seller/products?${query}`, {
          withCredentials: true,
        });
        setProducts(data.length ? data : []);
      } catch (err) {
        console.error("Failed to fetch seller products:", err);
        toast.error("Failed to fetch products!");
      }
      setLoading(false);
    };

    fetchProducts();
  }, [filters]);

  useEffect(() => {
    productsRef.current = [];
    requestAnimationFrame(() => {
      if (productsRef.current.length > 0) {
        gsap.fromTo(
          productsRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power3.out",
          }
        );
      }
    });
  }, [products]);

  const addToRefs = (el) => {
    if (el) productsRef.current.push(el);
  };

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <StoreSidebar filters={filters} setFilters={setFilters} />

      <div className="flex-1 overflow-y-auto p-4 pt-14">
        <div className="grid grid-cols-5 gap-y-14 max-w-[1100px] mx-auto">
          <div
            onClick={() => setShowModal(true)}
            className="w-[180px] h-[220px] border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer group"
          >
            <div className="w-full h-full flex justify-center items-center">
              <p className="bg-gray-100 group-hover:bg-gray-200 border border-gray-300 text-4xl font-light px-3 py-1 rounded-full group">
                +
              </p>
            </div>
          </div>
          {loading
            ? Array.from({ length: 19 }).map((_, index) => (
                <div
                  key={index}
                  className="relative w-[180px] h-[220px] border border-gray-300 rounded-xl px-2 animate-pulse"
                >
                  <div className="w-25 h-25 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-200 rounded-full"></div>
                  <div className="mt-18 space-y-3">
                    <div className="">
                      <div className="w-20 h-4 bg-gray-200 rounded-md"></div>
                      <div className="w-16 h-3 bg-gray-200 rounded mt-1"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <img
                            key={num}
                            src="/images/user/store/star.png"
                            className="w-4"
                            alt=""
                          />
                        ))}
                      </div>
                      <div className="w-13 h-3 bg-gray-200 rounded mt-1"></div>
                    </div>

                    <div className="w-14 h-4 bg-gray-200 rounded mt-1"></div>
                    <div className="w-full h-7 bg-gray-200 rounded mt-6"></div>
                  </div>
                </div>
              ))
            : products.map((product) => (
                <div
                  ref={addToRefs}
                  key={product._id}
                  onClick={() => router.push(`/user/store/${product._id}`)}
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
                                ? "/images/user/store/star-active.png"
                                : "/images/user/store/star.png"
                            }
                            className="w-4"
                            alt=""
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-500">
                        {product.reviewCount} reviews
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">
                        ₹ {product.price}
                        <span className="text-xs text-gray-600">
                          /{product.unit}
                        </span>
                      </p>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            product.status == "active"
                              ? "bg-green-700"
                              : product.status == "blocked"
                              ? "bg-red-600"
                              : "bg-orange-500"
                          }`}
                        />
                        <p
                          className={`text-xs font-medium capitalize ${
                            product.status == "active"
                              ? "text-green-700"
                              : product.status == "blocked"
                              ? "text-red-600"
                              : "text-orange-600"
                          }`}
                        >
                          {product.status}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="w-full py-1.5 text-sm text-white bg-[#EB3D3F] rounded-md cursor-pointer mt-1"
                    >
                      Edit Product
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {showModal && <AddProductModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default SellerStore;
