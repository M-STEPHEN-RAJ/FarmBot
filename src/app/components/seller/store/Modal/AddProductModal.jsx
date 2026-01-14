"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddProductModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    type: "",
    price: "",
    unit: "",
    stock: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-5 pt-5 rounded-xl w-full max-w-[800px] space-y-8 mx-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Add Product</h3>
          <img
            src="/images/user/settings/close.png"
            className="w-4.5 cursor-pointer"
            onClick={onClose}
          />
        </div>

        <div className="flex items-center gap-10">
          <div className="">
            <img
              className="w-[250px] h-[250px] rounded-full bg-amber-200"
              src={"https://placehold.co/250"}
              alt="info"
            />
          </div>
          <div className="space-y-2">
            {/* Name */}
            <div className="flex flex-col">
              <label htmlFor="">Product Name</label>
              <input
                className="border border-gray-300 px-2 py-1.5 rounded-md outline-none"
                type="text"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label htmlFor="">Description</label>
              <textarea
                className="border border-gray-300 px-2 py-1.5 rounded-md outline-none"
                type="text"
              />
            </div>

            <div className="flex gap-5">
              {/* Category */}
              <div className="flex flex-col">
                <label htmlFor="">Category</label>
                <input
                  className="border border-gray-300 px-2 py-1.5 rounded-md outline-none"
                  type="text"
                />
              </div>

              {/* Type */}
              <div className="flex flex-col">
                <label htmlFor="">Type</label>
                <input
                  className="border border-gray-300 px-2 py-1.5 rounded-md outline-none"
                  type="text"
                />
              </div>
            </div>

            <div className="flex gap-5">
              {/* Price */}
              <div className="flex flex-col">
                <label htmlFor="">Price</label>
                <input
                  className="border border-gray-300 px-2 py-1.5 rounded-md outline-none"
                  type="text"
                />
              </div>

              {/* Unit */}
              <div className="flex flex-col">
                <label htmlFor="">Unit</label>
                <input
                  className="border border-gray-300 px-2 py-1.5 rounded-md outline-none"
                  type="text"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="flex flex-col">
              <label htmlFor="">Stock</label>
              <input
                className="w-fit border border-gray-300 px-2 py-1.5 rounded-md outline-none"
                type="text"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-5">
          <button onClick={onClose} className="text-[#EB3D3F] border border-[#EB3D3F] px-4 py-1 rounded-md cursor-pointer">Cancel</button>
          <button className="bg-[#EB3D3F] text-white px-4 py-1 rounded-md cursor-pointer">Add Product</button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
