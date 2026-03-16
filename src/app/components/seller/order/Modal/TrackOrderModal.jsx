"use client";
import React from "react";

const TRACK_STEPS = [
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const TrackOrderModal = ({ item, onClose }) => {
  if (!item) return null;

  const currentIndex = TRACK_STEPS.indexOf(item.status);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white px-6 py-5 rounded-xl w-full max-w-xl space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Track Package</h3>
          <div
            onClick={onClose}
            className="w-6 h-6 flex justify-center items-center hover:bg-gray-100 rounded-md cursor-pointer"
          >
            <img
              src="/images/user/settings/close.png"
              alt="Close"
              className="w-4.5 h-4.5"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex items-center gap-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-md border border-gray-200"
          />
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500 capitalize">
              Status: {item.status.replaceAll("_", " ")}
            </p>
          </div>
        </div>

        {/* Tracker */}
        <div className="relative pl-1 mt-2">
          {TRACK_STEPS.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isActive = index === currentIndex;
            const isDone = index <= currentIndex;

            return (
              <div key={step} className="flex gap-4 items-start">
                {/* Indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full mt-1 ${
                      isDone ? "bg-[#EB3D3F]" : "bg-gray-300"
                    }`}
                  />
                  {index !== TRACK_STEPS.length - 1 && (
                    <div
                      className={`h-8 w-0.5 mt-1 border-l-2 border-dashed ${
                        isCompleted ? "border-[#EB3D3F]" : "border-gray-300"
                      }`}
                    />
                  )}
                </div>

                {/* Label */}
                <p
                  className={`capitalize text-sm ${
                    isDone ? "font-medium text-[#EB3D3F]" : "text-gray-600"
                  }`}
                >
                  {step.replaceAll("_", " ")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderModal;
