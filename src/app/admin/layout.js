"use client";
import React, { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import Sidebar from "../components/common/AdminSidebar";
import AdminLoading from "../components/common/AdminLoading";
import AdminSessionWatcher from "../providers/AdminSessionWatcher";

const AdminLayout = ({ children }) => {
  const sidebarRef = useRef(null);
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const hideSidebar =
    pathname === "/admin/login";

  useEffect(() => {
    if (!hideSidebar && sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [hideSidebar]);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return (
    <AdminSessionWatcher>
      {loading && <AdminLoading />}
      <div className="flex w-full min-h-screen">
        {!hideSidebar && (
          <div ref={sidebarRef} className="p-1 sticky top-0 h-screen z-50">
            <Sidebar loading={loading} setLoading={setLoading} />
          </div>
        )}

        <main className="flex-1 flex justify-center">{children}</main>
      </div>
    </AdminSessionWatcher>
  );
};

export default AdminLayout;
