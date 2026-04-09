"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { API } from "@/app/utils/api";

const AdminSidebar = ({ loading, setLoading }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [admin, setAdmin] = useState(null);

  const isActive = (route) => pathname.startsWith(route);

  const navigate = (path) => {
    if (pathname === path) return;
    setLoading(true);
    router.push(path);
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/admin/me`, {
        withCredentials: true,
      });

      setAdmin(res.data.admin);

      console.log(res.data.admin);
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
            <img
              src="/images/admin/sidebar/logo.png"
              alt=""
              className="w-10"
            />
          </div>

          <div className="space-y-1">
            {/* <div
              onClick={() => navigate("/admin/dashboard")}
              className={`p-2 ${
                isActive("/admin/dashboard")
                  ? "bg-violet-100 hover:bg-violet-200"
                  : "hover:bg-violet-100"
              } rounded-md cursor-pointer group relative`}
            >
              <img
                src="/images/user/sidebar/dashboard.png"
                alt=""
                className="w-6"
              />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#6A1B9A] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
                Dashboard
              </div>
            </div> */}

            <div
              onClick={() => navigate("/admin/store")}
              className={`p-2 ${
                isActive("/admin/store")
                  ? "bg-violet-100 hover:bg-violet-200"
                  : "hover:bg-violet-100"
              } rounded-md cursor-pointer group relative`}
            >
              <img
                src="/images/user/sidebar/farmstore.png"
                alt=""
                className="w-6"
              />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#6A1B9A] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
                Admin Store
              </div>
            </div>

            {/* <div
              onClick={() => navigate("/seller/order")}
              className={`p-2 ${
                isActive("/seller/order")
                  ? "bg-red-200 hover:bg-red-300"
                  : "hover:bg-red-100"
              } rounded-md cursor-pointer group relative`}
            >
              <img
                src="/images/seller/sidebar/order.png"
                alt=""
                className="w-6"
              />
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#EB3D3F] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
                Orders
              </div>
            </div>   */}
          </div>
        </div>

        <div className="space-y-1">
          <div
            onClick={() => navigate("/admin/settings/accounts")}
            className={`p-2 ${
              isActive("/admin/settings")
                ? "bg-violet-200 hover:bg-violet-300"
                : "hover:bg-violet-100"
            } rounded-md cursor-pointer group relative`}
          >
            <img
              src="/images/user/sidebar/settings.png"
              alt=""
              className="w-6"
            />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#6A1B9A] text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
              Settings
            </div>
          </div>

          {admin ? (
            <div className="hover:bg-gray-300 rounded-full cursor-pointer">
              <Image
                src={admin.avatar}
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

export default AdminSidebar;
