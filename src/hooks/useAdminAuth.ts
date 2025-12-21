// src/hooks/useAdminAuth.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

export const useAdminAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // 1. Cek Token LocalStorage
        if (!token) {
          router.replace("/auth/login");
          return;
        }

        // 2. Cek Validasi ke Server
        const response = await axiosInstance.get("/auth/me");
        const user = response.data;

        // 3. Cek Role
        if (user.role === "admin") {
          setIsAuthorized(true);
        } else {
          // User ada, tapi bukan admin
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Authorization failed:", error);
        localStorage.removeItem("accessToken"); // Bersihkan token invalid
        router.replace("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  // Return value agar bisa dipakai component lain
  return { isAuthorized, isLoading };
};
