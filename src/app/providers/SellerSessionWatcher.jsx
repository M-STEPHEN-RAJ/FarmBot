"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API } from "../utils/api";

export default function SellerSessionWatcher({ children }) {
  const router = useRouter();

  const verifySession = async () => {
    try {
      const res = await axios.get(
        `${API}/api/auth/seller/me`,
        { withCredentials: true }
      );

      if (res.status !== 200 || !res.data?.ok) {
        toast.error("Session expired. Please login again!");
        router.push("/seller/login");
      }
    } catch (err) {
      toast.error("Session expired. Please login again!");
      router.push("/seller/login");
    }
  };

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "seller-session-change") {
        verifySession();
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return children;
}
