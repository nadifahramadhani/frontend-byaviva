import axios from "axios";

// Fallback ke localhost jika env belum diset
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- 1. INTERCEPTOR REQUEST (INI YANG KEMARIN HILANG) ---
// Tugas: Ambil token dari LocalStorage dan tempel ke Header Authorization
axiosInstance.interceptors.request.use(
  (config) => {
    // Pastikan kode ini jalan di browser (client-side)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken"); // Sesuai info kamu pake 'accessToken'

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 2. INTERCEPTOR RESPONSE ---
// Tugas: Jika token expired/salah (401), logout user otomatis
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Cek jika errornya 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.error("Token tidak valid atau kadaluarsa. Redirecting...");

      if (typeof window !== "undefined") {
        // Hapus token agar bersih
        localStorage.removeItem("accessToken");

        // Redirect ke login hanya jika kita belum ada di halaman login
        // (Mencegah loop refresh jika halaman login itu sendiri yang error 401)
        if (!window.location.pathname.includes("/auth/login")) {
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
