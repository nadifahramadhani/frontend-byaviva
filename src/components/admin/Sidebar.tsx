"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
// 👇 1. PERBAIKI IMPORT: Gabungkan useRouter disini
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookCheck,
  History,
  CalendarDays,
  Briefcase,
  Image as ImageIcon,
  FolderKanban,
  LogOut,
} from "lucide-react";
import axiosInstance from "@/lib/axios";

const MENU_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Booking", icon: BookCheck, href: "/admin/booking" },
  { label: "Riwayat", icon: History, href: "/admin/riwayat" },
  { label: "Schedule", icon: CalendarDays, href: "/admin/schedule" },
  { label: "Service", icon: Briefcase, href: "/admin/service" },
  { label: "Gallery", icon: ImageIcon, href: "/admin/gallery" },
  { label: "Portofolio", icon: FolderKanban, href: "/admin/portofolio" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      router.push("/auth/login");
    }
  };

  return (
    <aside className="w-[254px] h-screen bg-white fixed top-0 left-0 border-r border-gray-200 flex flex-col z-20 overflow-y-auto">
      {/* --- LOGO SECTION --- */}
      <div className="flex flex-col items-center pt-[40px] pb-[30px] gap-2">
        <div className="relative w-[76px] h-[31px]">
          <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
        </div>
        <div className="text-[14px] font-semibold font-montserrat text-slate-700">
          ByAviva Dashboard
        </div>
      </div>

      {/* --- MENU ITEMS --- */}
      <nav className="flex-1 flex flex-col gap-1 px-0 py-2 font-nunito-sans text-[16px]">
        {MENU_ITEMS.map((item, index) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              href={item.href}
              key={index}
              className={`flex items-center gap-3 px-[20px] py-[15px] cursor-pointer transition-all border-l-4 ${
                isActive
                  ? "bg-[#F0F8FF] border-blue-600 text-slate-900 font-bold"
                  : "bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <item.icon
                size={22}
                className={isActive ? "text-slate-900" : "text-gray-400"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- LOGOUT SECTION --- */}
      <div className="pb-8 mt-auto px-4">
        <button
          onClick={handleLogout} // 👈 2. TAMBAHKAN INI AGAR TOMBOL BERFUNGSI
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold font-nunito-sans text-[16px]"
        >
          <LogOut size={22} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
