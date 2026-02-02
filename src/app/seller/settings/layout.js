"use client";
import SellerSettingsSidebar from "@/app/components/seller/settings/SettingsSidebar";

export default function SellerSettingsLayout({ children }) {
  return (
    <div className="w-full flex min-h-screen">
      <SellerSettingsSidebar />

      <div className="flex-1 h-screen overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
}
