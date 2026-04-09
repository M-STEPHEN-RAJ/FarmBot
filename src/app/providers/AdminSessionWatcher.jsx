"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API } from "../utils/api";

export default function AdminSessionWatcher({ children }) {
  const router = useRouter();

  const verifySession = async () => {
    try {
      const res = await axios.get(
        `${API}/api/admin/me`,
        { withCredentials: true }
      );

      if (res.status !== 200 || !res.data?.ok) {
        toast.error("Admin session expired. Please login again!");
        router.push("/admin/login");
      }
    } catch (err) {
      toast.error("Admin session expired. Please login again!");
      router.push("/admin/login");
    }
  };

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "admin-session-change") {
        verifySession();
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return children;
}