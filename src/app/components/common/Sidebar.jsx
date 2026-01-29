"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { API } from "@/app/utils/api";

const Sidebar = ({ loading, setLoading }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);

  const isActive = (route) => pathname.startsWith(route);

  const navigate = (path) => {
    if (pathname === path) return;
    setLoading(true);
    router.push(path);
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/me`, {
        withCredentials: true,
      });

      setUser(res.data.user);

      console.log(res.data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return (
    <>
      <div className="h-[calc(100vh-8px)] flex flex-col justify-between items-center p-2 border border-gray-300 rounded-md">
        <div className="flex flex-col gap-3 items-center">
          <div className="w-10 h-10 flex justify-center items-center border border-gray-300 rounded-md">
            <img src="/images/user/sidebar/logo.png" alt="" className="w-10" />
          </div>

          <div className="space-y-1">
            <div
              className={`p-2 ${
                isActive("/user/dashboard")
                  ? "bg-gray-300 hover:bg-gray-400"
                  : "hover:bg-gray-100"
              } rounded-md cursor-pointer group relative`}
            >
              <img src="/images/user/sidebar/dashboard.png" alt="" className="w-6" />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
                Dashboard
              </div>
            </div>

            <div
              onClick={() => navigate("/user/store")}
              className={`p-2 ${
                isActive("/user/store")
                  ? "bg-gray-100 hover:bg-gray-200"
                  : "hover:bg-gray-100"
              } rounded-md cursor-pointer group relative`}
            >
              <img src="/images/user/sidebar/farmstore.png" alt="" className="w-6" />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
                Farm Store
              </div>
            </div>

            <div
              className={`p-2 ${
                isActive("/user/crop-recommendation")
                  ? "bg-gray-300 hover:bg-gray-400"
                  : "hover:bg-gray-100"
              } rounded-md cursor-pointer group relative`}
            >
              <img src="/images/user/sidebar/farmguide.png" alt="" className="w-6" />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
                Farm Guide
              </div>
            </div>

            <div
              onClick={() => navigate("/user/scanner")}
              className={`p-2 ${
                isActive("/user/scanner")
                  ? "bg-gray-100 hover:bg-gray-200"
                  : "hover:bg-gray-100"
              } rounded-md cursor-pointer group relative`}
            >
              <img src="/images/user/sidebar/farmdoc.png" alt="" className="w-6" />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
                Farm Doc
              </div>
            </div>

            <div
              onClick={() => navigate("/user/chatbot")}
              className={`p-2 ${
                isActive("/user/chatbot")
                  ? "bg-gray-100 hover:bg-gray-200"
                  : "hover:bg-gray-100"
              } rounded-md cursor-pointer group relative`}
            >
              <img src="/images/user/sidebar/chatbot.png" alt="" className="w-6" />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
                Farm AI
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div
            onClick={() => navigate("/user/cart")}
            className={`p-2 ${
              isActive("/user/cart")
                ? "bg-gray-200 hover:bg-gray-300"
                : "hover:bg-gray-100"
            } rounded-md cursor-pointer group relative`}
          >
            <img src="/images/user/sidebar/cart.png" alt="" className="w-6" />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
              Cart
            </div>
          </div>

          <div
            onClick={() => navigate("/user/order")}
            className={`p-2 ${
              isActive("/user/order")
                ? "bg-gray-200 hover:bg-gray-300"
                : "hover:bg-gray-100"
            } rounded-md cursor-pointer group relative`}
          >
            <span className="w-4 h-4 absolute top-0 right-0 flex justify-center items-center text-xs text-white bg-[#1B8841] rounded-full">
              3
            </span>
            <img
              src="/images/user/sidebar/order.png"
              alt=""
              className="w-6"
            />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
              Order
            </div>
          </div>

          <div
            onClick={() => navigate("/user/settings/accounts")}
            className={`p-2 ${
              isActive("/user/settings")
                ? "bg-gray-200 hover:bg-gray-300"
                : "hover:bg-gray-100"
            } rounded-md cursor-pointer group relative`}
          >
            <img src="/images/user/sidebar/settings.png" alt="" className="w-6" />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#1B8841] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
              Settings
            </div>
          </div>

          {user ? (
            <div className="hover:bg-gray-300 rounded-full cursor-pointer">
              <Image
                src={user.avatar}
                className="p-1 w-10 h-10 rounded-full"
                alt=""
                width={40}
                height={40}
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-300 mx-auto mt-2 animate-pulse"></div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
