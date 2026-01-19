"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/app/utils/api";
import toast from "react-hot-toast";
import EditNameModal from "@/app/components/user/settings/Modal/EditNameModal";
import EditAvatarModal from "@/app/components/user/settings/Modal/EditAvatarModal";
import EditAddressModal from "@/app/components/user/settings/Modal/EditAddressModal";

const Accounts = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditNameOpen, setisEditNameOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

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

  const openAddAddressModal = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (idx) => {
    setEditingAddress(user.addressHistory[idx]);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (form, id) => {
    try {
      let res;
      if (id) {
        res = await axios.patch(`${API}/address/${id}`, form, {
          withCredentials: true,
        });
        toast.success("Address updated!");
      } else {
        res = await axios.post(`${API}/address`, form, {
          withCredentials: true,
        });
        toast.success("Address added!");
      }

      setUser(res.data.user);
      setIsAddressModalOpen(false);
      setEditingAddress(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (idx) => {
    const addressId = user.addressHistory[idx]._id;
    try {
      const res = await axios.delete(`${API}/address/${addressId}`, {
        withCredentials: true,
      });
      setUser(res.data.user);
      toast.success("Address deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (idx) => {
    const addressId = user.addressHistory[idx]._id;
    try {
      const res = await axios.patch(
        `${API}/address/default/${addressId}`,
        {},
        { withCredentials: true },
      );
      setUser((prev) => ({
        ...prev,
        defaultShippingAddress: res.data.defaultShippingAddress,
      }));
      toast.success("Default address updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default address");
    }
  };

  const handleEditAddress = (idx) => {
    setEditingAddressIdx(idx);
    setIsAddAddressOpen(true);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });

      localStorage.clear();

      window.location.href = "/user/login";
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
      <div className="w-full max-w-[850px] h-screen mx-auto space-y-5 overflow-y-auto">
        <h2 className="font-medium">Personal Information</h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div
              onClick={() => setIsAvatarOpen(true)}
              className="relative cursor-pointer"
            >
              <img className="w-18 rounded-full" src={user.avatar} alt="" />
              <div className="absolute -bottom-1 -right-1 p-1.5 border border-gray-300 bg-white rounded-full">
                <img
                  src="/images/user/settings/camera.png"
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
              <img
                src="/images/user/settings/edit.png"
                className="w-5"
                alt=""
              />
              <p className="text-sm">Edit</p>
            </div>
          </div>
        </div>

        <h2 className="font-medium mt-8">Addresses</h2>

        <div className="space-y-4">
          {user.addressHistory?.length > 0 ? (
            user.addressHistory.map((addr, idx) => (
              <div
                key={addr._id}
                className="flex justify-between items-center border border-gray-300 p-3 rounded-md"
              >
                <div>
                  <p className="font-medium">{addr.name}</p>
                  <p className="text-gray-600 text-sm">
                    {addr.addressLine},<br/> {addr.city}, {addr.state} -{" "}
                    {addr.pincode}
                  </p>
                  <p className="text-sm font-light text-gray-600">{addr.phone}</p>
                  {user.defaultShippingAddress &&
                    JSON.stringify(addr) ===
                      JSON.stringify(user.defaultShippingAddress) && (
                      <span className="text-xs text-green-500 font-medium">
                        Default
                      </span>
                    )}
                </div>

                <div className="flex gap-2">
                  <button
                    className="text-blue-500 text-sm"
                    onClick={() => openEditAddressModal(idx)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 text-sm"
                    onClick={() => handleDeleteAddress(idx)}
                  >
                    Delete
                  </button>
                  <button
                    className="text-green-500 text-sm"
                    onClick={() => handleSetDefault(idx)}
                  >
                    Set Default
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500"></p>
          )}

          <button
            className="mt-2 px-3 py-1 bg-[#166831] text-white rounded-md cursor-pointer"
            onClick={openAddAddressModal}
          >
            + Add New Address
          </button>
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

      {isAvatarOpen && (
        <EditAvatarModal
          currentAvatar={user.avatar}
          onClose={() => setIsAvatarOpen(false)}
          onSave={(avatar) => setUser((prev) => ({ ...prev, avatar }))}
        />
      )}

      {isAddressModalOpen && (
        <EditAddressModal
          address={editingAddress}
          onClose={() => {
            setIsAddressModalOpen(false);
            setEditingAddress(null);
          }}
          onSave={handleSaveAddress}
        />
      )}
    </>
  );
};

export default Accounts;
