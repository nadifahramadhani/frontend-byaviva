"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // <--- Tambah ini
import { jwtDecode } from "jwt-decode";
import { authService } from "@/services/auth.service";

// --- LOGIC: PENGENDALI TOKEN GOOGLE ---
function GoogleTokenReceiver() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("accessToken", token);
      try {
        const decoded: any = jwtDecode(token);
        // alert(`Login Google Berhasil! Halo ${decoded.role}`);

        if (decoded.role === "admin" || decoded.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        router.push("/auth/login");
      }
    }
  }, [searchParams, router]);

  return null;
}

// --- HALAMAN UTAMA (FULL CODE) ---
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });
      const token = response.data.token;
      if (!token) throw new Error("Gagal token");

      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(response.data));

      const decoded: any = jwtDecode(token);
      // alert("Login Berhasil!");

      if (decoded.role === "admin" || decoded.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Email atau password salah");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Suspense fallback={null}>
        <GoogleTokenReceiver />
      </Suspense>

      {/* KARTU PUTIH UTAMA */}
      <div className="w-full max-w-[561px] bg-foundation-whitenormal rounded-[30px] shadow-xl px-6 py-10 md:p-[50px] relative flex flex-col items-center gap-[30px]">
        {/* LOGO & TITLE */}
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Placeholder Logo (Ganti <img> kalau sudah ada file logonya) */}
          {/* LOGO BYAVIVA */}
          <div className="relative w-[102px] h-[41px]">
            <Image
              src="/logo.svg"
              alt="Logo Byaviva"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-foundation-text-primarynormal text-2xl font-bold">
            Login Shoot Byviva
          </h2>
          <p className="text-foundation-text-primarynormal text-sm text-center px-4 leading-relaxed">
            Masuk dengan akun resmi untuk melanjutkan pemesanan dan galeri.
          </p>
        </div>

        {/* FORM INPUT */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm text-center border border-red-200">
              {error}
            </div>
          )}

          {/* INPUT EMAIL */}
          <div className="flex flex-col items-start justify-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
            <label className="font-bold text-foundation-blacknormal text-base">
              Email
            </label>

            <input
              suppressHydrationWarning // <--- TAMBAHKAN INI
              className="h-[46px] px-3 py-[11px] w-full bg-foundation-whitenormal rounded-md border-2 border-solid border-foundation-accent-2darker text-neutrals-800 focus:outline-none focus:border-foundation-primarynormal transition"
              placeholder="Masukan Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* INPUT PASSWORD */}
          <div className="flex flex-col items-start justify-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
            <label className="font-bold text-foundation-blacknormal text-base">
              Password
            </label>

            <input
              suppressHydrationWarning // <--- TAMBAHKAN INI
              className="h-[46px] px-3 py-[11px] w-full bg-foundation-whitenormal rounded-md border-2 border-solid border-foundation-accent-2darker text-neutrals-800 focus:outline-none focus:border-foundation-primarynormal transition"
              placeholder="Masukan Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Ingat Saya & Lupa Password */}
          <div className="flex items-center justify-between w-full px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-foundation-secondarynormal"
              />
              <span className="text-sm font-medium text-foundation-text-primarynormal">
                Ingat Saya
              </span>
            </label>
            <div className="text-sm font-medium text-foundation-whitedark-active cursor-pointer hover:text-foundation-secondarynormal hover:underline transition">
              Lupa Password?
            </div>
          </div>

          {/* TOMBOL MASUK */}
          <button
            suppressHydrationWarning // <--- TAMBAHKAN INI
            type="submit"
            disabled={isLoading}
            className="bg-foundation-secondarynormal hover:bg-foundation-secondarydark text-white font-bold flex items-center justify-center gap-2 px-6 py-4 w-full rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Memuat..." : "Masuk"}
          </button>
        </form>

        {/* BAGIAN GOOGLE */}
        <div className="w-full flex flex-col items-center gap-4 mt-[-10px]">
          <p className="text-xs text-center text-foundation-text-primarynormal">
            Belum Punya Akun?{" "}
            <Link
              href="/auth/register"
              className="font-bold text-[#023047] hover:underline"
            >
              Daftar Disini
            </Link>
          </p>

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            className="h-[54px] w-full border-2 border-solid border-foundation-secondarynormal flex items-center justify-center gap-3 rounded-lg cursor-pointer hover:bg-gray-50 transition no-underline group"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="G"
              className="w-6 h-6 group-hover:scale-110 transition-transform"
            />
            <span className="font-bold text-blackblack-500 text-base">
              Lanjut Dengan Google
            </span>
          </a>

          <div className="text-xs text-center text-foundation-text-primarynormal opacity-70 max-w-xs leading-tight">
            Nikmati kemudahan pemesanan dan pengelolaan foto Anda secara online.
          </div>
        </div>
      </div>
    </div>
  );
}
