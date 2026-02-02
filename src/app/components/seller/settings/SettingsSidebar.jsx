"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const SettingsSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

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
            <div className="px-2 py-2 flex items-center gap-3 hover:bg-red-100 rounded-md cursor-pointer">
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
              onClick={() => router.push("/seller/settings/accounts")}
              className={`px-2 py-2 flex items-center gap-3 hover:bg-red-100 ${
                pathname.includes("accounts")
                  ? "bg-red-200 hover:bg-red-300"
                  : ""
              } rounded-md cursor-pointer`}
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
              onClick={() => router.push("/seller/settings/privacy")}
              className={`px-2 py-2 flex items-center gap-3 hover:bg-red-100 ${
                pathname.includes("privacy")
                  ? "bg-red-200 hover:bg-red-300"
                  : ""
              } rounded-md cursor-pointer`}
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
            <div className="px-2 py-2 flex items-center gap-3 hover:bg-red-100 rounded-md cursor-pointer">
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
              onClick={() => router.push("/seller/settings/notification")}
              className={`px-2 py-2 flex items-center gap-3 hover:bg-red-100 ${
                pathname.includes("notification")
                  ? "bg-red-200 hover:bg-red-300"
                  : ""
              } rounded-md cursor-pointer`}
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
    </div>
  );
};

export default SettingsSidebar;
