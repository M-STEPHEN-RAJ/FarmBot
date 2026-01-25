"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { API } from "@/app/utils/api";
import toast from "react-hot-toast";
import EditNameModal from "@/app/components/user/settings/Modal/EditNameModal";
import EditAvatarModal from "@/app/components/user/settings/Modal/EditAvatarModal";
import EditAddressModal from "@/app/components/user/settings/Modal/EditAddressModal";

const Accounts = () => {
  const dropdownRefs = useRef({});
  const addressRefs = useRef({});

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditNameOpen, setisEditNameOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [openDropdownIdx, setOpenDropdownIdx] = useState(null);

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
    const address = user.addressHistory[idx];
    const el = addressRefs.current[address._id];

    if (!el) return;

    // GSAP animation
    gsap.to(el, {
      x: -120,
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: async () => {
        try {
          const res = await axios.delete(`${API}/address/${address._id}`, {
            withCredentials: true,
          });

          setUser(res.data.user);
          toast.success("Address deleted!");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete address");

          gsap.to(el, {
            x: 0,
            opacity: 1,
            duration: 0.3,
          });
        }
      },
    });
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInside = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(e.target),
      );

      if (!clickedInside) {
        setOpenDropdownIdx(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return (
    <>
    <div className="w-full max-w-[850px] h-screen mx-auto space-y-5 overflow-y-auto animate-pulse">
      <div className="w-42 h-5 bg-gray-200 rounded-md"/>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-18 h-18 bg-gray-200 rounded-full"></div>
          <div>
            <div className="w-30 h-4 bg-gray-200 rounded-md"></div>
            <div className="w-40 h-3.5 bg-gray-200 rounded-md mt-2.5"></div>
            <div className="w-12 h-3 bg-gray-200 rounded-sm mt-1"></div>
          </div>
        </div>
        <div className="w-20 h-7 bg-gray-200 rounded-md"></div>
      </div>

      <div className="w-22 h-5 mt-8 bg-gray-200 rounded-md"/>

      <div className="space-y-4">
        <div className="relative flex justify-between items-center">
          <div className="mt-1.5 space-y-2">
            <div className="w-40 h-5 bg-gray-200 rounded-md"></div>
            <div className="w-60 h-4 bg-gray-200 rounded-sm"></div>
            <div className="w-50 h-4 bg-gray-200 rounded-sm"></div>
            <div className="w-25 h-3.5 bg-gray-200 rounded-md"></div>
          </div>
          <div className="absolute top-2 right-0 w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      <div className="w-45 h-8 bg-gray-200 rounded-md mt-10"></div>

      <div className="w-42 h-5 bg-gray-200 rounded-md mt-5"/>

      <div className="w-20 h-8 bg-gray-200 rounded-md"></div>
    </div>
    </>
  );

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
          {user.addressHistory?.map((addr, idx) => (
            <div
              key={addr._id}
              ref={(el) => (addressRefs.current[addr._id] = el)}
              className={`relative flex justify-between items-center ${
                openDropdownIdx === idx ? "z-50" : "z-0"
              }`}
            >
              <div>
                <p className="font-medium">{addr.name}</p>
                <p className="text-gray-700 text-sm">
                  {addr.addressLine},<br /> {addr.city}, {addr.state} -{" "}
                  {addr.pincode}
                </p>
                <p className="text-sm font-light text-gray-600">{addr.phone}</p>
                {user.defaultShippingAddress?._id === addr._id && (
                  <span className="text-xs text-green-500 font-medium">
                    Default
                  </span>
                )}
              </div>

              <div
                ref={(el) => (dropdownRefs.current[addr._id] = el)}
                className="absolute top-0 right-0"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownIdx(openDropdownIdx === idx ? null : idx);
                  }}
                  className="p-2 hover:bg-gray-200 rounded-full cursor-pointer"
                >
                  <img
                    className="w-4 h-4"
                    src="/images/user/chatbot/more.png"
                    alt="menu"
                  />
                </div>

                {openDropdownIdx === idx && (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-2 w-34 bg-white border border-gray-300 rounded-md z-50"
                  >
                    <button
                      onClick={() => {
                        openEditAddressModal(idx);
                        setOpenDropdownIdx(null);
                      }}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer"
                    >
                      <img
                        className="w-5 h-5"
                        src="/images/user/settings/edit.png"
                        alt=""
                      />
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        handleDeleteAddress(idx);
                        setOpenDropdownIdx(null);
                      }}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-md cursor-pointer"
                    >
                      <img
                        className="w-5 h-5"
                        src="/images/user/settings/delete.png"
                        alt=""
                      />
                      Delete
                    </button>

                    {user.defaultShippingAddress?._id !== addr._id && (
                      <button
                        onClick={() => {
                          handleSetDefault(idx);
                          setOpenDropdownIdx(null);
                        }}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-gray-100 rounded-md cursor-pointer"
                      >
                        <img
                          className="w-5 h-5"
                          src="/images/user/settings/default.png"
                          alt=""
                        />
                        Set Default
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

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
