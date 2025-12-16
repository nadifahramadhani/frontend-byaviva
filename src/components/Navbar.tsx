"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react"; // Tambahkan ikon User
import { Logo } from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // --- LOGIKA AUTHENTICATION ---
  // Ganti nilai ini dengan state auth asli Anda.
  // Contoh: const { user } = useAuth(); atau cek token di localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simulasi cek login (Hapus useEffect ini jika sudah pakai Auth Context asli)
  useEffect(() => {
    // Contoh: Cek apakah ada token di localStorage
    const token = localStorage.getItem("token");
    // Jika ada token, kita anggap user login (sesuaikan dengan logic Anda)
    // setIsLoggedIn(!!token);

    // Untuk demo saat ini, saya set TRUE (Ganti ke false untuk melihat tombol Login)
    setIsLoggedIn(true);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Portofolio", href: "/portofolio" },
    { label: "About", href: "/about" },
    { label: "Booking", href: "/booking" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-cyan-800 z-50">
      <div className="h-[94px] px-6 md:px-14 max-w-7xl mx-auto flex justify-between items-center">
        {/* --- Logo --- */}
        <div className="w-24 h-10 relative z-50">
          <Logo />
        </div>

        {/* --- Hamburger Menu (Mobile Only) --- */}
        <button
          className="md:hidden text-white z-50 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* --- Desktop Navigation (Hidden on Mobile) --- */}
        <div className="hidden md:inline-flex items-start gap-6 relative flex-[0_0_auto]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`inline-flex items-center gap-2 px-0 py-3 relative flex-[0_0_auto] cursor-pointer border-b-2 transition-colors duration-200 ${
                  isActive
                    ? "border-foundation-whitenormal"
                    : "border-transparent"
                }`}
              >
                <div
                  className={`mt-[-2.00px] text-[length:var(--labels-l1-b-font-size)] text-center tracking-[var(--labels-l1-b-letter-spacing)] leading-[var(--labels-l1-b-line-height)] relative w-fit font-labels-l1-b font-[number:var(--labels-l1-b-font-weight)] whitespace-nowrap ${
                    isActive
                      ? "text-foundation-whitenormal"
                      : "text-foundation-text-secondarylight-hover"
                  }`}
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>

        {/* --- Desktop Auth Button (Login / Profile) --- */}
        {isLoggedIn ? (
          // JIKA LOGIN: TAMPILKAN TOMBOL PROFILE
          <Link
            href="/dashboard"
            className="hidden md:inline-flex all-[unset] box-border items-center justify-center gap-2 px-5 py-3 flex-[0_0_auto] rounded-lg overflow-hidden border-2 border-solid border-foundation-text-secondarylight bg-white/10 relative cursor-pointer hover:bg-white/20 transition-colors"
          >
            <User size={20} className="text-foundation-whitelight-active" />
            <span className="mt-[-2.00px] text-foundation-whitelight-active text-[length:var(--labels-l2-b-font-size)] tracking-[var(--labels-l2-b-letter-spacing)] leading-[var(--labels-l2-b-line-height)] relative w-fit font-labels-l2-b font-[number:var(--labels-l2-b-font-weight)] whitespace-nowrap">
              Profile
            </span>
          </Link>
        ) : (
          // JIKA BELUM LOGIN: TAMPILKAN TOMBOL LOGIN
          <Link
            href="/auth/login"
            className="hidden md:inline-flex all-[unset] box-border items-center justify-center gap-2 px-5 py-3 flex-[0_0_auto] rounded-lg overflow-hidden border-2 border-solid border-foundation-text-secondarylight relative cursor-pointer hover:bg-white/10 transition-colors"
          >
            <span className="mt-[-2.00px] text-foundation-whitelight-active text-[length:var(--labels-l2-b-font-size)] tracking-[var(--labels-l2-b-letter-spacing)] leading-[var(--labels-l2-b-line-height)] relative w-fit font-labels-l2-b font-[number:var(--labels-l2-b-font-weight)] whitespace-nowrap">
              Login
            </span>
          </Link>
        )}

        {/* --- Mobile Menu Overlay --- */}
        {isOpen && (
          <div className="absolute top-[94px] left-0 w-full bg-cyan-800 border-t border-white/10 shadow-xl flex flex-col p-6 gap-4 md:hidden">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`w-full py-3 border-b border-white/10 ${
                    isActive ? "bg-white/10 rounded-lg px-4" : "px-4"
                  }`}
                >
                  <div
                    className={`text-[length:var(--labels-l1-b-font-size)] text-left tracking-[var(--labels-l1-b-letter-spacing)] leading-[var(--labels-l1-b-line-height)] font-labels-l1-b font-[number:var(--labels-l1-b-font-weight)] ${
                      isActive
                        ? "text-foundation-whitenormal"
                        : "text-foundation-text-secondarylight-hover"
                    }`}
                  >
                    {item.label}
                  </div>
                </Link>
              );
            })}

            {/* Mobile Auth Button */}
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="mt-4 all-[unset] box-border flex items-center justify-center gap-2 px-5 py-3 rounded-lg overflow-hidden border-2 border-solid border-foundation-text-secondarylight bg-white/10 relative cursor-pointer hover:bg-white/20 transition-colors w-full"
              >
                <User size={20} className="text-foundation-whitelight-active" />
                <span className="text-foundation-whitelight-active text-[length:var(--labels-l2-b-font-size)] tracking-[var(--labels-l2-b-letter-spacing)] leading-[var(--labels-l2-b-line-height)] font-labels-l2-b font-[number:var(--labels-l2-b-font-weight)]">
                  Profile
                </span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="mt-4 all-[unset] box-border flex items-center justify-center gap-2 px-5 py-3 rounded-lg overflow-hidden border-2 border-solid border-foundation-text-secondarylight relative cursor-pointer hover:bg-white/10 transition-colors w-full"
              >
                <span className="text-foundation-whitelight-active text-[length:var(--labels-l2-b-font-size)] tracking-[var(--labels-l2-b-letter-spacing)] leading-[var(--labels-l2-b-line-height)] font-labels-l2-b font-[number:var(--labels-l2-b-font-weight)]">
                  Login
                </span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
