"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/app/utils/api";
import toast from "react-hot-toast";
import EditNameModal from "@/app/components/settings/Modal/EditNameModal";

const Accounts = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditNameOpen, setisEditNameOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/me`, {
        withCredentials: true,
      });

      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });

      localStorage.clear();

      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="w-full max-w-[850px] mx-auto space-y-5">
        <h2 className="font-medium">Personal Information</h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                className="w-18 rounded-full cursor-pointer"
                src={user.avatar}
                alt=""
              />
              <div className="absolute -bottom-1 -right-1 p-1.5 border border-gray-300 bg-white rounded-full">
                <img
                  src="/images/settings/camera.png"
                  className="w-4.5"
                  alt=""
                />
              </div>
            </div>

            <div>
              <p className="">{user.name}</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <p className="font-medium text-xs">
                {new Date(user.createdAt).toLocaleString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              setisEditNameOpen(true);
            }}
            className="border border-gray-300 py-1 px-3 rounded-md cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <img src="/images/settings/edit.png" className="w-5" alt="" />
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

      {isEditNameOpen && (
        <EditNameModal
          currentName={user.name}
          email={user.email}
          onClose={() => setisEditNameOpen(false)}
          onSave={(newName) => setUser((prev) => ({ ...prev, name: newName }))}
        />
      )}
    </>
  );
};

export default Accounts;
