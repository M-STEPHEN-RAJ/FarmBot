"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API } from "@/app/utils/api";
import ScannerSidebar from "@/app/components/user/scanner/ScannerSidebar";

const Scanner = () => {
  const params = useParams();
  const selectedScanId = params?.id;

  const [scanDetails, setScanDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchScanDetails = async () => {
      if (!selectedScanId) {
        setScanDetails(null);
        return;
      }

      setLoadingDetails(true);
      try {
        const res = await axios.get(`${API}/scanner/${selectedScanId}`, {
          withCredentials: true,
        });
        setScanDetails(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch scan details:", err);
        toast.error("Failed to load scan details!");
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchScanDetails();
  }, [selectedScanId]);

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <ScannerSidebar selectedScanId={selectedScanId} />

      <div className="flex-1 flex flex-col overflow-y-auto p-4">
        {loadingDetails && (
          <div className="w-full max-w-[850px] flex flex-col justify-start items-center gap-5 mx-auto px-4 pt-1">
            <div className="w-full flex justify-start gap-10">
              <div className="rounded-xl h-[200px] w-[400px] bg-gray-300 animate-pulse" />
              <div className="flex flex-col justify-center items-center gap-10">
                <div className="w-60 h-5 bg-gray-200 rounded-sm animate-pulse" />
                <div className="w-60 h-5 bg-gray-200 rounded-sm animate-pulse" />
                <div className="w-60 h-5 bg-gray-200 rounded-sm animate-pulse" />
              </div>
            </div>

            <div className="w-full flex flex-col gap-3 mt-5 mx-start space-y-2">
              <div className="w-30 h-5 bg-gray-200 rounded-sm animate-pulse" />

              <div className="space-y-2">
                {Array.from({ length: 20 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full h-5 bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {scanDetails && !loadingDetails && (
          <div className="w-full max-w-[850px] flex flex-col justify-center items-center gap-5 mx-auto">
            <div className="w-full grid grid-cols-[350px_320px_1fr] gap-5 px-4 pt-1">
              <img
                src={scanDetails.imageUrl}
                alt="Scan"
                className="rounded-xl w-full object-cover max-h-[180px] max-w-[350px]"
              />
              <div className="flex flex-col justify-between py-2">
                <div className="grid grid-cols-[110px_1fr]">
                  <b>Plant</b> {scanDetails.plantName}
                </div>
                <div className="grid grid-cols-[110px_1fr]">
                  <b>Prediction</b> {scanDetails.prediction}
                </div>
                <div className="grid grid-cols-[110px_1fr]">
                  <b>Confidence</b> {scanDetails.confidence}%
                </div>
              </div>

              <div className="relative flex items-center justify-center w-[140px] h-[140px]">
                <svg width="120" height="120">
                  {(() => {
                    const radius = 50;
                    const strokeWidth = 8;
                    const circumference = 2 * Math.PI * radius;
                    const offset =
                      circumference -
                      (scanDetails.confidence / 100) * circumference;

                    return (
                      <>
                        {/* Background */}
                        <circle
                          cx="60"
                          cy="60"
                          r={radius}
                          stroke="#e5e7eb"
                          strokeWidth={strokeWidth}
                          fill="none"
                        />

                        {/* Progress */}
                        <circle
                          cx="60"
                          cy="60"
                          r={radius}
                          stroke="#166831"
                          strokeWidth={strokeWidth}
                          fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                          transform="rotate(-90 60 60)"
                          className=""
                        />
                      </>
                    );
                  })()}
                </svg>
              
                <div className="absolute text-center">
                  <p className="text-lg font-medium text-[#166831]">
                    {scanDetails.confidence}%
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full p-4 bg-white space-y-2">
              <div className="">
                <p className="text-lg font-semibold">Explanation:</p>
                <div
                  className="text-gray-800 mt-3"
                  dangerouslySetInnerHTML={{ __html: scanDetails.explanation }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
