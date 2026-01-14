"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API } from "@/app/utils/api";

const EditNameModal = ({
  currentName,
  email,
  onClose,
  onSave,
  mode = "user",
}) => {
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name || name === currentName) {
      onClose();
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", name);

      const apiPath = mode === "seller" ? "/seller/me" : "/me";

      await axios.patch(`${API}${apiPath}`, formData, {
        withCredentials: true,
      });

      toast.success("Profile Updated successfully!");
      onSave(name);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white px-5 py-5 rounded-xl w-full max-w-sm space-y-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">Update Profile</h3>
          <div
            onClick={onClose}
            className="w-6 flex justify-between items-center hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <img
              src="/images/user/settings/close.png"
              className="w-4.5 h-4.5 mx-auto"
              alt=""
            />
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex flex-col gap-1">
            <label className="text-gray-500" htmlFor="">
              Name
            </label>
            <input
              className="px-2.5 py-1.5 border border-gray-300 rounded-md outline-none"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-500" htmlFor="">
              Email{" "}
              <span className="text-xs text-red-500">(cannot be editted)</span>
            </label>
            <input
              className="px-2.5 py-1.5 border border-gray-300 rounded-md outline-none disabled:opacity-60"
              type="text"
              value={email}
              disabled
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 text-sm">
          <button
            onClick={onClose}
            className={`w-22 py-1.5 border ${mode === "seller" ? "text-[#EB3D3F] border-[#EB3D3F]" : "text-[#166831] border-[#166831]"} rounded-md cursor-pointer font-medium`}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-22 py-1.5 ${mode === "seller" ? "bg-[#EB3D3F]" : "bg-[#166831]"} text-white rounded-md cursor-pointer disabled:opacity-60 flex items-center justify-center`}
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

export default EditNameModal;
