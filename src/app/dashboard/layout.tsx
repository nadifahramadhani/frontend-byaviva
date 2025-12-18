import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import Navbar from "@/components/Navbar";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-foundation-primarylight">
      {/* 1. NAVBAR (Paling Atas, Full Width) */}
      {/* z-50 agar dia berada di lapisan paling atas menutupi sidebar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
        <Navbar />
      </div>

      {/* 2. WRAPPER BAWAH (Sidebar + Konten) */}
      {/* Kita beri pt-[94px] (sesuaikan tinggi navbar) agar tidak tertutup navbar */}
      <div className="pt-[94px] flex">
        {/* SIDEBAR */}
        {/* Kita bungkus div fixed agar posisinya pas di bawah navbar */}
        <div className="fixed left-0 bottom-0 top-[94px] w-[254px] overflow-y-auto border-r border-gray-200 bg-white z-40">
          {/* Panggil Sidebar, tapi pastikan style h-screen di dalam komponen Sidebar dihapus/disesuaikan */}
          <Sidebar />
        </div>

        {/* MAIN CONTENT */}
        {/* Margin left selebar sidebar */}
        <main className="flex-1 ml-[254px] p-6 md:px-10">{children}</main>
      </div>
    </div>
  );
}
