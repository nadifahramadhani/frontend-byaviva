"use client";

import React from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth"; // <--- Import Hook Kita

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- PANGGIL HOOK DISINI ---
  // Cukup satu baris ini saja!
  const { isAuthorized, isLoading } = useAdminAuth();

  // --- TAMPILAN LOADING ---
  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400 mb-4" />
        <p className="text-slate-500 font-medium font-montserrat">
          Memverifikasi akses admin...
        </p>
      </div>
    );
  }

  // --- CEK OTORISASI ---
  if (!isAuthorized) {
    return null;
  }

  // --- RENDER UTAMA ---
  return (
    <div className="flex w-full min-h-screen bg-white font-montserrat">
      <Sidebar />
      <main className="flex-1 ml-[254px] flex flex-col pt-[30px] pr-0 min-h-screen bg-white">
        {children}
      </main>
    </div>
  );
}
