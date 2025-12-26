"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/app/utils/api";

const Accounts = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/me`, {
        withCredentials: true,
      });

      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full max-w-[850px] mx-auto space-y-5">
        
      <h2 className="font-medium">Personal Information</h2>
      
      <div className="flex items-center gap-5">
        <img className="w-16 rounded-full" src={user.avatar} alt="" />

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

      <h2 className="font-medium">Change Password</h2>

      <h2 className="font-medium">Logout</h2>
    </div>
  );
};

export default Accounts;
