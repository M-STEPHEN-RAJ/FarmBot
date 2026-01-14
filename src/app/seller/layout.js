"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import SellerLoading from "../components/common/SellerLoading";
import SellerSidebar from "../components/common/SellerSidebar";
import SellerSessionWatcher from "../providers/SellerSessionWatcher";

const SellerLayout = ({ children }) => {

  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const hideSidebar =
    pathname === "/seller/login" || pathname === "/seller/register";

  return (
    <SellerSessionWatcher>
      {loading && <SellerLoading />}
      <div className="flex w-full min-h-screen">
        {!hideSidebar && (
          <div className="p-1 sticky top-0 h-screen z-50">
            <SellerSidebar loading={loading} setLoading={setLoading} />
          </div>
        )}

        <main className="flex-1 flex justify-center">{children}</main>
      </div>
    </SellerSessionWatcher>
  );
};

export default SellerLayout;
