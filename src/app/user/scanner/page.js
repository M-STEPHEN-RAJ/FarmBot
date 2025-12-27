"use client";

import ScannerSidebar from "@/app/components/scanner/ScannerSidebar";
import React, { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

const ScannerHome = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback(() => setIsDragging(true), []);
  const handleDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false);
  }, []);
  const handleDragOver = useCallback((e) => e.preventDefault(), []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);

    files.forEach((file) => {
      const validTypes = ["image/png", "image/jpg", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type!");
      } else {
        toast.success(`File accepted: ${file.name}`);
      }
    });
  }, []);

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <ScannerSidebar />

      <div
        className="flex-1 relative flex items-center justify-center p-4"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#166831]/80 pointer-events-none">
            <img className="absolute w-10 top-5 left-5" src="/images/scanner/overlay.png" alt="" />
            <img className="absolute w-10 top-5 right-5 rotate-90" src="/images/scanner/overlay.png" alt="" />
            <img className="absolute w-10 bottom-5 left-5 rotate-270" src="/images/scanner/overlay.png" alt="" />
            <img className="absolute w-10 bottom-5 right-5 rotate-180" src="/images/scanner/overlay.png" alt="" />
            <p className="text-white text-3xl font-bold text-center">
              Drop image anywhere
            </p>
          </div>
        )}
        <div className="w-full max-w-[700px] flex flex-col justify-center items-center gap-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium">Upload your Image</h2>
            <p className="text-sm text-gray-600 text-center">
              Drag & Drop your image here
            </p>
          </div>
          <div className="w-[450px] h-[250px] flex flex-col items-center justify-center border-2 border-green-600 border-dashed rounded-lg cursor-pointer">
            <div className="w-40 h-40 relative bg-[#166831] rounded-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-[60px] bg-white rounded-xl z-10 shadow-2xl"></div>
              <div className="absolute top-9.5 left-8 w-12 h-[50px] bg-gray-300 rounded-tl-[10px] rounded-tr-md"></div>
              <div className="absolute top-11 left-19 w-12.5 h-[50px] bg-gray-300 rounded-r-[10px]"></div>
            </div>
            <p className="text-gray-500 text-sm mt-5">
              Image should be png, jpg, jpeg.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerHome;
