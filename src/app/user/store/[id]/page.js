"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { API } from "@/app/utils/api";

const ProductDetails = () => {
  
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/store/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch product!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="w-full max-w-[1150px] min-h-screen flex flex-col items-center overflow-hidden pr-4 py-4">
      <div className="w-full flex items-start py-1">
        <div onClick={() => router.push('/user/store')} className="rounded-full p-2 hover:bg-gray-200 cursor-pointer">
            <img className="w-5" src="/images/store/back.png" alt="" />
        </div>
      </div>
      <div className="w-full grid grid-cols-[2fr_3fr_1.5fr] gap-6">
        <div className="">
          <img src={product.image} alt="" />
        </div>
        <div className="space-y-5">
          <div className="border-b border-gray-300 pb-2">
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-gray-500 text-lg font-medium">{product.type}</p>

            <div className="flex items-center gap-2">
              <p className="text-lg font-medium mt-1">{product.rating}</p>
              <div className="flex gap-0">
                {[1, 2, 3, 4, 5].map((num) => (
                  <img
                    key={num}
                    src={
                      num <= product.rating
                        ? "/images/store/star-active.png"
                        : "/images/store/star.png"
                    }
                    className="w-6"
                    alt=""
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm mt-1">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="">
            <div className="flex gap-4">
              <p className="text-red-600 text-xl mt-1">-10%</p>
              <p className="text-3xl font-medium flex items-start gap-1">
                <span className="text-sm font-normal mt-[1.8px]">₹</span>
                {product.price}.00
                <span className="text-gray-600 text-sm mt-[9px]">
                  /{product.unit}
                </span>
              </p>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              M.R.P:{" "}
              <span className="line-through">
                ₹{Math.round(product.price / (1 - 10 / 100))}.00
              </span>
            </p>

            <p className="text-sm mt-3">Inclusive of all taxes</p>
          </div>

          <div className="flex gap-8 border-b border-gray-300 pb-3">
            <div className="flex flex-col justify-center items-center gap-1.5">
              <div className="bg-gray-100 p-2 rounded-full">
                <img className="w-6.5" src="/images/store/cash-on-delivery.png" alt="" />
              </div>
              <p className="text-xs text-center">Pay on <br/>Delivery</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1.5">
              <div className="bg-gray-100 p-2 rounded-full">
                <img className="w-6.5" src="/images/store/top-brands.png" alt="" />
              </div>
              <p className="text-xs text-center">Top <br/>Brand</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1.5">
              <div className="bg-gray-100 p-2 rounded-full">
                <img className="w-6.5" src="/images/store/secure.png" alt="" />
              </div>
              <p className="text-xs text-center">Secure <br/>Transaction</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-medium">About this Item</h2>
            <p className="text-sm">{product.description}</p>
          </div>
        </div>
        <div className="h-[350px] flex flex-col justify-between border border-gray-300 p-4 rounded-lg">
          <p className="text-2xl font-medium flex items-start gap-1">
            <span className="text-sm font-normal mt-[1.8px]">₹</span>
            {product.price}.00
            <span className="text-gray-600 text-sm mt-1.5">
              /{product.unit}
            </span>
          </p>

          <div className="flex items-center gap-2 cursor-pointer">
            <img className="w-4" src="/images/store/location.png" alt="" />
            <p className="w-40 text-sm truncate hover:underline">
              902, MiddleStreet, Chinnammalpuram, Dhalapathysamudram.
            </p>
          </div>

          <p
            className={`text-md font-medium ${
              product.stock > 0 ? "text-[#166831]" : "text-red-600"
            }`}
          >
            {product.stock > 0 ? `In stock` : "Out of stock"}
          </p>

          <div className="grid grid-cols-[max-content_1fr] text-xs text-gray-500 gap-y-1.5 gap-x-3">
            <span className="font-medium">Sold by</span>
            <span>FarmBot</span>

            <span className="font-medium">Payment</span>
            <span>Secure Transaction</span>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 font-medium">Quantity</p>
              <div className="w-[100px] flex justify-between items-center">
                <button className="flex justify-center items-center h-5 w-5 text-xl font-medium text-red-500 bg-red-100 rounded cursor-pointer">
                  −
                </button>
                <p className="w-5 text-center">1</p>
                <button className="flex justify-center items-center h-5 w-5 text-xl font-medium text-green-500 bg-green-100 rounded cursor-pointer">
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                disabled={product.stock === 0}
                className="text-white bg-[#166831] rounded-md py-1 px-4 cursor-pointer"
              >
                Add to Cart
              </button>
              <button
                disabled={product.stock === 0}
                className="text-white bg-green-600 rounded-md py-1 px-4 cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      reviews
    </div>
  );
};

export default ProductDetails;
