import axios from "axios";

// Ganti URL sesuai port backend NestJS kamu
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- INTERCEPTOR REQUEST (PENTING!) ---
// Tugasnya: Sebelum request terbang, cek LocalStorage, ambil token, tempel ke Header.
// src/lib/axios.ts

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token basi. Hapus dan tendang ke login.
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR RESPONSE (OPSIONAL) ---
// Tugasnya: Kalau token basi (401), otomatis redirect ke login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Session expired or unauthorized. Redirecting to login...");
      // Opsional: Hapus token & paksa logout jika 401 muncul terus menerus
      // localStorage.removeItem("accessToken");
      // window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
