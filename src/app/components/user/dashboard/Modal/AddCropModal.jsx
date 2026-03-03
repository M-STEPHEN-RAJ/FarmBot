"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddCropModal = ({ open, onClose, onSuccess }) => {
  const cropRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [crop, setCrop] = useState("");
  const [startDate, setStartDate] = useState("");
  const [openCrop, setOpenCrop] = useState(false);

  const cropOptions = ["Potato", "Tomato", "Onion", "Rice", "Maize"];

  const handleSave = async () => {
    if (!crop || !startDate) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setSaving(true);

      await axios.post(
        "/api/dashboard",
        {
          name: crop.toLowerCase(),
          startDate,
        },
        { withCredentials: true },
      );

      toast.success("Crop added successfully!");
      setCrop("");
      setStartDate("");
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add crop");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cropRef.current && !cropRef.current.contains(e.target)) {
        setOpenCrop(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white px-6 py-5 rounded-xl w-[500px] space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Add New Crop</h3>

          <img
            src="/images/user/settings/close.png"
            className="w-4.5 cursor-pointer"
            onClick={onClose}
          />
        </div>

        <div className="space-y-3">
          <div ref={cropRef} className="flex flex-col gap-1 relative">
            <label className="text-sm text-gray-700">Crop</label>

            <button
              type="button"
              onClick={() => setOpenCrop(!openCrop)}
              className="w-full border border-gray-300 px-3 py-1.5 rounded-md flex justify-between items-center cursor-pointer"
            >
              {crop || "Select Crop"}

              <img
                src="/images/user/store/dropdown.png"
                className={`w-4 transition ${openCrop ? "rotate-180" : ""}`}
              />
            </button>

            {openCrop && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow z-20">
                {cropOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setCrop(option);
                      setOpenCrop(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 px-3 py-1.5 rounded-md outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-5">
          <button
            onClick={onClose}
            className="text-gray-700 border border-gray-300 px-4 py-1 rounded-md cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-28 flex items-center justify-center bg-[#166831] text-white px-4 py-1 rounded-md cursor-pointer"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCropModal;
