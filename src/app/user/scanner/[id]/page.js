"use client";

import ScannerSidebar from "@/app/components/scanner/ScannerSidebar";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API } from "@/app/utils/api";

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
      {/* Sidebar */}
      <ScannerSidebar selectedScanId={selectedScanId} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4">
        {loadingDetails && (
          <p className="text-gray-500 mt-20 text-center">
            Loading scan details...
          </p>
        )}

        {scanDetails && !loadingDetails && (
          <div className="w-full max-w-[800px] flex flex-col justify-start items-center gap-10 mx-auto">
            <div className="w-full flex justify-between items-center px-4 pt-1">
              <img
                src={scanDetails.imageUrl}
                alt="Scan"
                className="rounded-xl w-full object-cover max-h-[200px] max-w-[400px]"
              />
              <div className="flex flex-col gap-2">
                <p>
                  <b>Prediction:</b> {scanDetails.prediction}
                </p>
                <p>
                  <b>Confidence:</b> {scanDetails.confidence}%
                </p>
                <p><b>Plant:</b> {scanDetails.plantName}</p>
              </div>
            </div>

            <div className="w-full p-4 bg-white space-y-2">
              <div>
                <b>Explanation:</b>
                <div
                  className="mt-1 text-gray-700"
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
