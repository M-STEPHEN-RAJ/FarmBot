"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API } from "@/app/utils/api";
import toast from "react-hot-toast";
import LogoutModal from "@/app/components/admin/settings/Modal/LogoutModal";

const AdminSettings = () => {
  const router = useRouter();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/admin/me`, {
        withCredentials: true,
      });

      if (!res.data?.admin) {
        router.replace("/admin/login");
        return;
      }

      setAdmin(res.data.admin);
    } catch (err) {
      if (err.response?.status === 401) {
        router.replace("/admin/login");
        toast.success("Admin not Found. Please log in!");
        return;
      } else {
        toast.error("Something went wrong!");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/admin/logout`, {}, { withCredentials: true });

      localStorage.removeItem("admin");

      window.location.href = "/admin/login";
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading)
    return (
      <>
        <div className="w-full max-w-[850px] h-screen mx-auto space-y-5 overflow-y-auto animate-pulse">
          <div className="w-42 h-5 bg-gray-200 rounded-md" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-18 h-18 bg-gray-200 rounded-full"></div>
              <div>
                <div className="w-30 h-4 bg-gray-200 rounded-md"></div>
                <div className="w-40 h-3.5 bg-gray-200 rounded-md mt-2.5"></div>
                <div className="w-12 h-3 bg-gray-200 rounded-sm mt-1"></div>
              </div>
            </div>
          </div>

          <div className="w-20 h-8 bg-gray-200 rounded-md"></div>
        </div>
      </>
    );
  if (!admin) return null;

  return (
    <>
      <div className="w-full max-w-[850px] mx-auto space-y-5">
        <h2 className="font-medium">Personal Information</h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <img className="w-18 rounded-full" src={admin.avatar} alt="" />
              {/* <div className="absolute -bottom-1 -right-1 p-1.5 border border-gray-300 bg-white rounded-full">
                <img
                  src="/images/user/settings/camera.png"
                  className="w-4.5"
                  alt=""
                />
              </div> */}
            </div>

            <div>
              <p className="">{admin.name}</p>
              <p className="text-gray-500 text-sm">{admin.email}</p>
              <p className="font-medium text-xs">
                {new Date(admin.createdAt).toLocaleString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setShowLogoutModal(true)}
          className="w-fit text-sm text-red-500 font-medium px-4 py-1 border border-red-500 rounded-sm cursor-pointer"
        >
          Logout
        </div>
      </div>
      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={async () => {
            setShowLogoutModal(false);
            await handleLogout();
          }}
        />
      )}
    </>
  );
};

export default AdminSettings;
