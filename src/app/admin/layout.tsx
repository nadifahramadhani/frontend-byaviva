import React from "react";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen bg-white font-montserrat">
      {/* 1. SIDEBAR (Akan muncul di semua halaman admin) */}
      {/* Sidebar sudah fixed position di dalam komponennya sendiri */}
      <Sidebar />

      {/* 2. MAIN CONTENT WRAPPER */}
      {/* Margin-left 254px untuk memberi ruang agar konten tidak tertutup sidebar */}
      {/* pt-[30px] dipindah ke sini agar semua halaman seragam */}
      <main className="flex-1 ml-[254px] flex flex-col pt-[30px] pr-0 min-h-screen bg-white">
        {children}
      </main>
    </div>
  );
}
