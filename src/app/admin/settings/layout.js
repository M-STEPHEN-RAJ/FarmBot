"use client";
import AdminSettingsSidebar from "@/app/components/admin/settings/SettingsSidebar";

export default function SellerSettingsLayout({ children }) {
  return (
    <div className="w-full flex min-h-screen">
      <AdminSettingsSidebar />

      <div className="flex-1 h-screen overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
}
