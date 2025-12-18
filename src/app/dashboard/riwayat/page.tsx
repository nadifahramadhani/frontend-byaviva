"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

// Import Komponen Reusable
import { PageHeaderCard } from "@/components/dashboard/PageHeaderCard";
import { TableSearch } from "@/components/ui/TableSearch";
import { Pagination } from "@/components/ui/Pagination";
import { HistoryTable } from "@/components/booking/history/HistoryTable";

export default function RiwayatPage() {
  // --- STATE MANAGEMENT ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce Search Logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch API Logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/booking/history", {
          params: { page, limit: 10, search: debouncedSearch },
        });
        setData(res.data.data);
        setTotalPages(res.data.meta.lastPage);
      } catch (error) {
        console.error("Gagal ambil history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, debouncedSearch]);

  // --- RENDER ---
  return (
    <div className="flex flex-col items-center w-full">
      {/* 1. HEADER STICKY */}
      <div className="sticky top-[94px] z-10 w-full bg-foundation-primarylight pb-5 pt-2 transition-all">
        <PageHeaderCard
          title="Riwayat Booking"
          subtitle="Daftar booking foto Anda yang telah selesai atau dibatalkan."
        />
      </div>

      {/* 2. CONTAINER UTAMA */}
      <div className="flex flex-col items-start gap-[20px] p-[20px] md:p-[40px] w-full bg-white rounded-[20px] shadow-sm min-h-[80vh]">
        {/* Toolbar: Search (Bisa ditambah Filter lain disini) */}
        <div className="w-full flex justify-end">
          <TableSearch
            value={search}
            onChange={setSearch}
            placeholder="Cari No. Booking / Nama Klien..."
          />
        </div>

        {/* Tabel Data & Pagination */}
        <div className="w-full border border-gray-200 rounded-xl overflow-hidden">
          <HistoryTable data={data} loading={loading} />

          {/* Pagination hanya muncul jika tidak loading dan ada data */}
          {!loading && data.length > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
