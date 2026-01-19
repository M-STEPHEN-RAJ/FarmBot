"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const EditAddressModal = ({ address, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (address) setForm(address);
  }, [address]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.addressLine ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setSaving(true);
      await onSave(form, address?._id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white px-6 py-5 rounded-xl w-full max-w-xl space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {address ? "Edit Address" : "Add New Address"}
          </h3>
          <div
            onClick={onClose}
            className="w-6 h-6 flex justify-center items-center hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <img
              src="/images/user/settings/close.png"
              alt="Close"
              className="w-4.5 h-4.5"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-2">
          <div className="flex flex-col gap-0.5">
            <label className="text-gray-500 text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md outline-none"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="text-gray-500 text-sm">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md outline-none"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="text-gray-500 text-sm">Address Line</label>
            <input
              type="text"
              name="addressLine"
              value={form.addressLine}
              onChange={handleChange}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md outline-none"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="text-gray-500 text-sm">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md outline-none"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="text-gray-500 text-sm">State</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md outline-none"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="text-gray-500 text-sm">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4 text-sm">
          <button
            onClick={onClose}
            className="w-24 py-1.5 border border-gray-300 rounded-md text-gray-700 font-medium cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-24 py-1.5 bg-[#166831] text-white rounded-md cursor-pointer disabled:opacity-60 flex items-center justify-center"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAddressModal;
