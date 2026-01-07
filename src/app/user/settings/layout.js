"use client";
import SettingsSidebar from "@/app/components/user/settings/SettingsSidebar";

export default function SettingsLayout({ children }) {
  return (
    <div className="w-full flex min-h-screen">
      <SettingsSidebar />

      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
}
