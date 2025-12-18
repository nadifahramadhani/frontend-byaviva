"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { FileText, Folder, Image as ImageIcon, LogOut } from "lucide-react";
import { ToolbarItemSidebar } from "./ToolbarItemSidebar";
import axiosInstance from "@/lib/axios";

const MENU_ITEMS = [
  {
    label: "My Bookings",
    icon: FileText,
    path: "/dashboard",
  },
  {
    label: "Riwayat",
    icon: Folder,
    path: "/dashboard/riwayat",
  },
  {
    label: "Gallery",
    icon: ImageIcon,
    path: "/dashboard/gallery",
  },
];

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

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
    <>
      <aside className="hidden md:flex flex-col w-[290px] h-screen fixed top-0 left-0 bg-white border-r border-gray-200 z-20 pt-[110px] pb-8 transition-all duration-300">
        {/* MENU UTAMA */}
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive =
              item.path === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.path);

            return (
              <div
                key={item.label}
                onClick={() => router.push(item.path)}
                className="cursor-pointer"
              >
                <ToolbarItemSidebar
                  text={item.label}
                  property1={isActive ? "active" : "default"}
                  icon={
                    <item.icon
                      // Ikon tetap putih agar kontras dengan background baru
                      className={`w-5 h-5 ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                  }
                  // PERUBAHAN DISINI:
                  // Jika active, kita paksa background jadi #19778D
                  className={`w-full transition-colors duration-200 ${
                    isActive ? "!bg-[#19778D]" : "hover:bg-gray-50"
                  }`}
                />
              </div>
            );
          })}
        </nav>

        {/* FOOTER SIDEBAR (LOGOUT) */}
        <div className="px-6 mt-auto">
          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={handleLogout}
              className="w-full text-left focus:outline-none"
            >
              <ToolbarItemSidebar
                text="Log Out"
                property1="default"
                icon={
                  <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                }
                divClassName="!text-red-500 group-hover:!text-red-600 font-medium"
                className="hover:bg-red-50 transition-colors group"
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
