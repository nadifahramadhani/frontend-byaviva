"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Cek Token di LocalStorage (atau Cookies, sesuaikan tempat kamu simpan token)
    const token = localStorage.getItem("accessToken"); // Ganti 'accessToken' sesuai nama key kamu

    if (!token) {
      // 2. Jika tidak ada token, lempar ke halaman Login
      // 'returnUrl' berguna agar setelah login, user balik lagi ke booking
      router.push("/auth/login?returnUrl=/booking");
    } else {
      // 3. Jika ada token, izinkan akses
      // (Opsional: Kamu bisa validasi token ke API /me di sini kalau mau lebih ketat)
      setIsAuthorized(true);
    }
  }, [router]);

  // Tampilkan Loading saat sedang mengecek...
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memeriksa akses...</p>
        </div>
      </div>
    );
  }

  // Render halaman jika sudah login
  return <>{children}</>;
}
