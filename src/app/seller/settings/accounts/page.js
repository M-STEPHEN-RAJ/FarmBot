"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API } from "@/app/utils/api";
import toast from "react-hot-toast";
import EditNameModal from "@/app/components/user/settings/Modal/EditNameModal";
import EditAvatarModal from "@/app/components/user/settings/Modal/EditAvatarModal";

const SellerSettings = () => {
  const router = useRouter();

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showEditAvatar, setShowEditAvatar] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/seller/me`, {
        withCredentials: true,
      });

      if (!res.data?.seller) {
        router.replace("/seller/login");
        return;
      }

      setSeller(res.data.seller);
    } catch (err) {
      if (err.response?.status === 401) {
        router.replace("/seller/login");
        toast.success("User not Found. Please log in!");
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
      await axios.post(`${API}/seller/logout`, {}, { withCredentials: true });

      localStorage.clear();

      window.location.href = "/seller/login";
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!seller) return null;

  return (
    <>
      <div className="w-full max-w-[850px] mx-auto space-y-5">
        <h2 className="font-medium">Personal Information</h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div onClick={() => setShowEditAvatar(true)} className="relative cursor-pointer">
              <img className="w-18 rounded-full" src={seller.avatar} alt="" />
              <div className="absolute -bottom-1 -right-1 p-1.5 border border-gray-300 bg-white rounded-full">
                <img
                  src="/images/user/settings/camera.png"
                  className="w-4.5"
                  alt=""
                />
              </div>
            </div>

            <div>
              <p className="">{seller.name}</p>
              <p className="text-gray-500 text-sm">{seller.email}</p>
              <p className="font-medium text-xs">
                {new Date(seller.createdAt).toLocaleString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div
            onClick={() => setShowEdit(true)}
            className="border border-gray-300 py-1 px-3 rounded-md cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <img
                src="/images/user/settings/edit.png"
                className="w-5"
                alt=""
              />
              <p className="text-sm">Edit</p>
            </div>
          </div>
        </div>

        <h2 className="font-medium">Change Password</h2>

        <div
          onClick={handleLogout}
          className="w-fit text-sm text-red-500 font-medium px-4 py-1 border border-red-500 rounded-sm cursor-pointer"
        >
          Logout
        </div>
      </div>

      {showEdit && (
        <EditNameModal
          currentName={seller.name}
          email={seller.email}
          mode="seller"
          onClose={() => setShowEdit(false)}
          onSave={(updatedName) =>
            setSeller((prev) => ({ ...prev, name: updatedName }))
          }
        />
      )}

      {showEditAvatar && (
        <EditAvatarModal
          currentAvatar={seller.avatar}
          mode="seller"
          onClose={() => setShowEditAvatar(false)}
          onSave={(avatar) => setSeller((prev) => ({ ...prev, avatar }))}
        />
      )}
    </>
  );
};

export default SellerSettings;
