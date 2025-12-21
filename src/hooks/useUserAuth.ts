// src/hooks/useUserAuth.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

// Parameter shouldCheck defaultnya true.
// Nanti kita set false kalau ada token di URL (lagi proses login Google)
export const useUserAuth = (shouldCheck: boolean = true) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kalau shouldCheck false (misal lagi handle Google token), jangan cek dulu.
    if (!shouldCheck) {
      setIsLoading(false); // Matikan loading biar proses lain jalan
      return;
    }

    const checkAccess = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // 1. Cek Token LocalStorage
        if (!token) {
          router.replace("/auth/login");
          return;
        }

        // 2. Cek Validasi ke Server (/auth/me)
        // Kita cuma butuh return 200 OK, gak perlu cek role spesifik
        await axiosInstance.get("/auth/me");

        // Kalau sukses (gak error), berarti authorized
        setIsAuthorized(true);
      } catch (error) {
        console.error("User authorization failed:", error);
        localStorage.removeItem("accessToken"); // Token basi/palsu
        router.replace("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [router, shouldCheck]);

  return { isAuthorized, isLoading };
};
