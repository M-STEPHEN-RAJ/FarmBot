"use client";
import React, { useState } from "react";

const DeleteModal = ({ onClose, onConfirm, chatTitle }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white px-6 py-5 rounded-xl w-full max-w-sm space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-medium">Delete Chat</h3>
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

        <p className="text-sm text-gray-800">
          Are you sure you want to delete "{chatTitle}"?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`w-20 px-4 py-1.5 text-sm rounded-md flex justify-center items-center gap-2
    ${
      loading
        ? "bg-red-400 cursor-not-allowed text-white"
        : "bg-red-600 hover:bg-red-500 text-white cursor-pointer"
    }`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
