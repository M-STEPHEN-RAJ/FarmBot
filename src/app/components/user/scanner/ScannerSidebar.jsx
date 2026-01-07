"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { API } from "@/app/utils/api";

const ScannerSidebar = ({ selectedScanId, onSelectScan, refreshFlag }) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  const dropdownRef = useRef(null);
  const router = useRouter();
  const scanRefs = useRef([]);

  const fetchScans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/scanner/scans`, {
        withCredentials: true,
      });

      setScans(res.data.scans || []);
    } catch (err) {
      console.error("Failed to fetch scans:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScan = async (scanId) => {
    try {
      await axios.delete(`${API}/scanner/${scanId}`, {
        withCredentials: true,
      });
      fetchScans();
      toast.success("Scan deleted!");
      router.push("/user/scanner");
    } catch (err) {
      console.error("Failed to delete scan:", err);
      toast.success("Failed to delete scan!");
    }
  };

  const handleNewScan = () => {
    router.push("/user/scanner");
  };

  useEffect(() => {
    if (scans.length > 0) {
      gsap.fromTo(
        scanRefs.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" }
      );
    }
  }, [scans]);

  useEffect(() => {
    fetchScans();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-[280px] h-screen overflow-y-auto space-y-4 py-4 border-r border-gray-300">
      <div className="sticky top-0 space-y-4 bg-white pb-3 z-10">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-medium">Farm Doc</h2>
          <div className="p-1 hover:bg-gray-100 rounded-md cursor-pointer">
            <img src="/images/user/chatbot/closepanel.svg" alt="" className="w-5" />
          </div>
        </div>

        <div className="-mt-1 space-y-0.5">
          <div
            onClick={handleNewScan}
            className="px-2 py-2 flex items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer"
          >
            <img src="/images/user/chatbot/newchat.png" alt="" className="w-5" />
            <p className="text-sm">New Scan</p>
          </div>
          <div className="px-2 py-2 flex items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer">
            <img src="/images/user/chatbot/search.png" alt="" className="w-5" />
            <p className="text-sm">Search scans</p>
          </div>
        </div>
      </div>

      <div className="-mt-2 space-y-2 pr-2">
        <p className="text-sm text-gray-500 px-2">Scans</p>

        <div className="">
          {loading &&
            Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="px-2 py-2 flex justify-between items-center gap-3 rounded-md group animate-pulse"
              >
                <div className="w-50 h-4 bg-gray-200 rounded-sm"></div>
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              </div>
            ))}

          {scans.map((scan, index) => (
            <div
              key={scan._id}
              ref={(el) => scanRefs.current[index] = el}
              onClick={() => {
                router.push(`/user/scanner/${scan._id}`);
              }}
              className={`relative px-2 py-2 flex justify-between items-center gap-3 ${
                selectedScanId === scan._id
                  ? "bg-[#eeeef1] hover:bg-gray-200"
                  : "hover:bg-gray-100"
              } rounded-md cursor-pointer group`}
            >
              <p className="text-sm truncate">{scan.prediction}</p>
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === scan._id ? null : scan._id);
                }}
                src="/images/user/chatbot/more.png"
                alt=""
                className={`w-4 mr-1.5 opacity-0 ${
                  openMenuId === scan._id ? "opacity-100" : ""
                } group-hover:opacity-100 transition-opacity duration-100`}
              />

              {openMenuId === scan._id && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full right-0 mt-1 w-25 bg-white border border-gray-200 rounded-md shadow-sm z-10"
                >
                  <div
                    onClick={() => setOpenMenuId(null)}
                    className="flex items-center gap-2 w-full text-[13px] text-left px-2 py-1 hover:bg-gray-100 text-gray-600 rounded-b-md cursor-pointer"
                  >
                    <img src="/images/user/chatbot/rename.png" className='h-4.5 w-4.5' alt="" />  
                    Rename
                  </div>
                  <div
                    onClick={() => {
                      handleDeleteScan(scan._id);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center gap-2 w-full text-[13px] text-left px-2 py-1 hover:bg-red-50 text-red-600 rounded-t-md cursor-pointer"
                  >
                    <img src="/images/user/chatbot/delete.png" className='h-4.5 w-4.5' alt="" />                    
                    Delete
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScannerSidebar;
