"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const SettingsSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [usage, setUsage] = useState({ totalRequests: 0, maxRequests: 0 });

  useEffect(() => {
    fetch("/api/hf-usage")
      .then((res) => res.json())
      .then((data) => setUsage(data))
      .catch((err) => console.error("Error fetching usage:", err));
  }, []);

  const usagePercent = usage.maxRequests
    ? Math.min(100, Math.round((usage.totalRequests / usage.maxRequests) * 100))
    : 0;

  const usageColor =
    usagePercent < 70
      ? "bg-green-600"
      : usagePercent < 90
        ? "bg-yellow-500"
        : "bg-red-600";

  return (
    <div className="w-[280px] flex flex-col justify-between h-screen space-y-3 py-4 border-r border-gray-300">
      <div className="space-y-3">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-medium">Settings</h2>
          <div className="p-1 hover:bg-gray-100 rounded-md cursor-pointer">
            <img
              src="/images/user/chatbot/closepanel.svg"
              alt=""
              className="w-5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="space-y-0.5 pr-2">
            <div className="px-2 py-2 flex items-center gap-3 hover:bg-gray-100 rounded-md cursor-pointer">
              <img
                src="/images/user/settings/general.png"
                alt=""
                className="w-5"
              />
              <p className="text-sm">General</p>
            </div>
          </div>

          <div className="space-y-0.5 pr-2">
            <div
              onClick={() => router.push("/user/settings/accounts")}
              className={`px-2 py-2 flex items-center gap-3 hover:bg-gray-100 ${pathname.includes("accounts") ? "bg-gray-200 hover:bg-gray-300" : ""} rounded-md cursor-pointer`}
            >
              <img
                src="/images/user/settings/account.png"
                alt=""
                className="w-5"
              />
              <p className="text-sm">Accounts</p>
            </div>
          </div>

          <div className="space-y-0.5 pr-2">
            <div
              onClick={() => router.push("/user/settings/privacy")}
              className={`px-2 py-2 flex items-center gap-3 hover:bg-gray-100 ${pathname.includes("privacy") ? "bg-gray-200 hover:bg-gray-300" : ""} rounded-md cursor-pointer`}
            >
              <img
                src="/images/user/settings/privacy.png"
                alt=""
                className="w-5"
              />
              <p className="text-sm">Privacy</p>
            </div>
          </div>

          <div className="space-y-0.5 pr-2">
            <div 
              onClick={() => router.push("/user/settings/support")}
              className={`px-2 py-2 flex items-center gap-3 hover:bg-gray-100 ${pathname.includes("support") ? "bg-gray-200 hover:bg-gray-300" : ""} rounded-md cursor-pointer`}
            >
              <img
                src="/images/user/settings/support.png"
                alt=""
                className="w-5"
              />
              <p className="text-sm">Support</p>
            </div>
          </div>

          <div className="space-y-0.5 pr-2">
            <div
              onClick={() => router.push("/user/settings/notification")}
              className={`px-2 py-2 flex items-center gap-3 hover:bg-gray-100 ${pathname.includes("notification") ? "bg-gray-200 hover:bg-gray-300" : ""} rounded-md cursor-pointer`}
            >
              <img
                src="/images/user/settings/notification.png"
                alt=""
                className="w-5"
              />
              <p className="text-sm">Notification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Gemini API Usage */}
        <div className="px-2">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Gemini API Usage
          </h3>
          <div className="w-full bg-gray-300 h-2 rounded-full mb-1.5">
            <div
              className={`${usageColor} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${usagePercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-700">
            {usage.totalRequests} of {usage.maxRequests} requests used (
            {usagePercent}%)
          </p>
        </div>

        {/* Hugging Face API Usage */}
        <div className="px-2">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Hugging Face API Usage
          </h3>
          <div className="w-full bg-gray-300 h-2 rounded-full mb-1.5">
            <div
              className={`${usageColor} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${usagePercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-700">
            {usage.totalRequests} of {usage.maxRequests} requests used (
            {usagePercent}%)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
