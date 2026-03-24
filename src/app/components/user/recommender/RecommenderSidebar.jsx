"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API } from "@/app/utils/api";

const RecommenderSidebar = ({ selectedId, onSelect, refreshFlag }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  const dropdownRef = useRef(null);
  const router = useRouter();
  const itemRefs = useRef([]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/recommender/crops`, {
        withCredentials: true,
      });

      setItems(res.data.crops || []);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/recommender/${id}`, {
        withCredentials: true,
      });
      fetchItems();
      toast.success("Deleted!");
      router.push("/user/recommender");
    } catch (err) {
      console.error("Failed to delete:", err);
      toast.error("Failed to delete!");
    }
  };

  const handleNew = () => {
    router.push("/user/recommender");
  };

  useEffect(() => {
    if (items.length > 0) {
      gsap.fromTo(
        itemRefs.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" },
      );
    }
  }, [items]);

  useEffect(() => {
    fetchItems();
  }, [refreshFlag]);

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
          <h2 className="text-medium">Farm Guide</h2>
          <div className="p-1 hover:bg-gray-100 rounded-md cursor-pointer">
            <img
              src="/images/user/chatbot/closepanel.svg"
              alt=""
              className="w-5"
            />
          </div>
        </div>

        <div className="-mt-1 space-y-0.5">
          <div
            onClick={handleNew}
            className="px-2 py-2 flex items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer"
          >
            <img
              src="/images/user/chatbot/newchat.png"
              alt=""
              className="w-5"
            />
            <p className="text-sm">New Recommendation</p>
          </div>

          <div className="px-2 py-2 flex items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer">
            <img src="/images/user/chatbot/search.png" alt="" className="w-5" />
            <p className="text-sm">Search</p>
          </div>
        </div>
      </div>

      <div className="-mt-2 space-y-2 pr-2">
        <p className="text-sm text-gray-500 px-2">Recommendations</p>

        <div>
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="px-2 py-2 flex justify-between items-center gap-3 rounded-md animate-pulse"
                >
                  <div className="w-50 h-4 bg-gray-200 rounded-sm"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
              ))
            : items.map((item, index) => (
                <div
                  key={item._id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  onClick={() => {
                    router.push(`/user/recommender/${item._id}`);
                  }}
                  className={`relative px-2 py-2 flex justify-between items-center gap-3 ${
                    openMenuId === item._id ? "z-50" : "z-0"
                  } ${
                    selectedId === item._id
                      ? "bg-[#eeeef1] hover:bg-gray-200"
                      : "hover:bg-gray-100"
                  } rounded-md cursor-pointer group`}
                >
                  <p className="text-sm truncate">{item.crop}</p>

                  <img
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === item._id ? null : item._id);
                    }}
                    src="/images/user/chatbot/more.png"
                    alt=""
                    className={`w-4 mr-1.5 opacity-0 ${
                      openMenuId === item._id ? "opacity-100" : ""
                    } group-hover:opacity-100 transition-opacity duration-100`}
                  />

                  {openMenuId === item._id && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-full right-0 mt-1 w-25 bg-white border border-gray-200 rounded-md shadow-sm z-10"
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-2 w-full text-[13px] px-2 py-1 hover:bg-gray-100 text-gray-600 cursor-pointer"
                      >
                        <img
                          src="/images/user/chatbot/rename.png"
                          className="h-4.5 w-4.5"
                          alt=""
                        />
                        Rename
                      </div>

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-2 w-full text-[13px] px-2 py-1 hover:bg-red-50 text-red-600 cursor-pointer"
                      >
                        <img
                          src="/images/user/chatbot/delete.png"
                          className="h-4.5 w-4.5"
                          alt=""
                        />
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

export default RecommenderSidebar;
