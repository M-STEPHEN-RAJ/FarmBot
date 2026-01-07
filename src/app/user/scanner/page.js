"use client";
import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/app/utils/api";
import { toast } from "react-hot-toast";
import ScannerSidebar from "@/app/components/user/scanner/ScannerSidebar";
import Lottie from "lottie-react";
import scannerAnimation from "../../../../public/lottie/scanner-animation.json";

const ScannerHome = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleDragEnter = useCallback(() => setIsDragging(true), []);
  const handleDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false);
  }, []);
  const handleDragOver = useCallback((e) => e.preventDefault(), []);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const sendToScanner = async (file) => {
    try {
      const imageBase64 = await fileToBase64(file);

      const res = await fetch(`${API}/scanner/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ imageBase64 }),
      });

      if (!res.ok) throw new Error("Prediction failed");

      const data = await res.json();
      return data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (!file) return;

      const validTypes = ["image/png", "image/jpg", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type!");
        return;
      }

      setIsScanning(true);
      toast.loading("Scanning image...");

      try {
        const result = await sendToScanner(file);

        toast.dismiss();
        toast.success("Scan completed!");

        router.push(`/user/scanner/${result._id}`);
      } catch {
        toast.dismiss();
      } finally {
        setIsScanning(false);
      }
    },
    [router, sendToScanner]
  );

  const handleFile = async (file) => {
    if (!file) return;

    const validTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type!");
      return;
    }

    setIsScanning(true);
    toast.loading("Scanning image...");

    try {
      const result = await sendToScanner(file);

      toast.dismiss();
      toast.success("Scan completed!");

      router.push(`/user/scanner/${result._id}`);
    } catch {
      toast.dismiss();
    } finally {
      setIsScanning(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <ScannerSidebar />

      <div className="flex-1 relative flex items-center justify-center p-4">
        {isScanning ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white">
            <Lottie
              animationData={scannerAnimation}
              loop
              className="w-64 h-64"
            />
            <p className="text-gray-600 text-lg mt-4 font-medium">
              Analyzing the Leaf
            </p>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {isDragging && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#166831]/80 pointer-events-none">
                <img
                  className="absolute w-10 top-5 left-5"
                  src="/images/user/scanner/overlay.png"
                  alt=""
                />
                <img
                  className="absolute w-10 top-5 right-5 rotate-90"
                  src="/images/user/scanner/overlay.png"
                  alt=""
                />
                <img
                  className="absolute w-10 bottom-5 left-5 rotate-270"
                  src="/images/user/scanner/overlay.png"
                  alt=""
                />
                <img
                  className="absolute w-10 bottom-5 right-5 rotate-180"
                  src="/images/user/scanner/overlay.png"
                  alt=""
                />
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
              <div
                onClick={handleClickUpload}
                className="w-[450px] h-[250px] flex flex-col items-center justify-center border-2 border-green-600 border-dashed rounded-lg cursor-pointer"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  hidden
                  onChange={(e) => handleFile(e.target.files[0])}
                />
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
        )}
      </div>
    </div>
  );
};

export default ScannerHome;
