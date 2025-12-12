"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Untuk link ke halaman login
import Image from "next/image";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();

  // State untuk 4 field
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Panggil Service Register
      await authService.register({
        name,
        email,
        phone,
        password,
      });

      // Jika sukses
      alert("Registrasi Berhasil! Silakan Login.");
      router.push("/auth/login"); // Arahkan pengguna ke halaman login
    } catch (err: any) {
      console.error(err);
      // Tampilkan pesan error dari backend jika ada
      setError(err.response?.data?.message || "Gagal mendaftar, coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* KARTU PUTIH REGISTER */}
      <div className="w-full max-w-[561px] bg-foundation-whitenormal rounded-[30px] shadow-xl px-6 py-10 md:p-[50px] relative flex flex-col items-center gap-[30px]">
        <div className="flex flex-col items-center gap-4 w-full">
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
            Bergabung dengan Byaviva
          </h2>
          <p className="text-foundation-text-primarynormal text-sm text-center px-4 leading-relaxed">
            Buat akun baru untuk mulai memesan.
          </p>
        </div>

        {/* --- FORMULIR YANG TADINYA HILANG --- */}
        <form onSubmit={handleRegister} className="w-full flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm text-center border border-red-200">
              {error}
            </div>
          )}

          {/* Input Nama */}
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold text-foundation-blacknormal text-sm md:text-base ml-1">
              Nama Lengkap
            </label>
            <input
              suppressHydrationWarning
              required
              className="h-[50px] px-4 w-full bg-foundation-whitenormal rounded-lg border-2 border-solid border-foundation-accent-2darker text-neutrals-800 focus:outline-none focus:border-foundation-primarynormal transition"
              placeholder="John Doe"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Input Email */}
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold text-foundation-blacknormal text-sm md:text-base ml-1">
              Email
            </label>
            <input
              suppressHydrationWarning
              required
              className="h-[50px] px-4 w-full bg-foundation-whitenormal rounded-lg border-2 border-solid border-foundation-accent-2darker text-neutrals-800 focus:outline-none focus:border-foundation-primarynormal transition"
              placeholder="contoh@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Input No HP */}
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold text-foundation-blacknormal text-sm md:text-base ml-1">
              Nomor HP
            </label>
            <input
              suppressHydrationWarning
              required
              className="h-[50px] px-4 w-full bg-foundation-whitenormal rounded-lg border-2 border-solid border-foundation-accent-2darker text-neutrals-800 focus:outline-none focus:border-foundation-primarynormal transition"
              placeholder="0812..."
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Input Password */}
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold text-foundation-blacknormal text-sm md:text-base ml-1">
              Password
            </label>
            <input
              suppressHydrationWarning
              required
              className="h-[50px] px-4 w-full bg-foundation-whitenormal rounded-lg border-2 border-solid border-foundation-accent-2darker text-neutrals-800 focus:outline-none focus:border-foundation-primarynormal transition"
              placeholder="******"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* TOMBOL DAFTAR */}
          <button
            suppressHydrationWarning
            type="submit"
            disabled={isLoading}
            className="h-[54px] w-full bg-foundation-secondarynormal hover:bg-foundation-secondarydark text-white font-bold rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-2"
          >
            {isLoading ? "Memuat..." : "Daftar Sekarang"}
          </button>
        </form>

        <p>
          Sudah punya akun?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-[#023047] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
