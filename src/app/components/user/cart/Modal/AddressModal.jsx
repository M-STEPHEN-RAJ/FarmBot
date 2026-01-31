"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API } from "@/app/utils/api";

const AddressModal = ({ addresses, selectedAddress, onSelect, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleSelect = async (addr) => {
    setLoading(true);
    try {
      // PATCH default address
      await axios.patch(`${API}/address/default/${addr._id}`, {}, { withCredentials: true });

      // Update parent state after successful PATCH
      onSelect(addr);

      toast.success("Default address updated!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update default address!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-lg w-[500px] max-w-[90%] p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-medium">Select Shipping Address</h2>

        {addresses.length === 0 && (
          <p className="text-sm text-gray-500">
            No addresses found. Please add one in your profile.
          </p>
        )}

        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`p-3 border rounded-md cursor-pointer ${
                selectedAddress?._id === addr._id
                  ? "border-[#166831] bg-[#f0fff5]"
                  : "border-gray-300"
              }`}
              onClick={() => handleSelect(addr)} // ✅ Use handleSelect here
            >
              <p className="font-medium">{addr.name}</p>
              <p className="text-sm text-gray-600">{addr.addressLine}</p>
              <p className="text-sm text-gray-600">
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-sm text-gray-600">{addr.phone}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={onClose}
            className="px-4 py-1 border border-gray-300 rounded-md"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
