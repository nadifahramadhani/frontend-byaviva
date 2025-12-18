"use client";
import React from "react";
import Link from "next/link";
import { Eye, FolderOpen, Inbox, Loader2 } from "lucide-react";
import { formatRupiah, formatDate, mapStatus } from "@/lib/format-utils";

// Interface Props
interface HistoryTableProps {
  data: any[];
  loading: boolean;
}

export const HistoryTable = ({ data, loading }: HistoryTableProps) => {
  // Helper Badge Status (Local)
  const getStatusBadge = (status: string) => (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${mapStatus(
        status
      )}`}
    >
      {status.replace("_", " ")}
    </span>
  );

  // --- RENDERING ---
  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-cyan-600" />
        <p className="text-sm">Memuat data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-400">
        <Inbox className="w-10 h-10 mb-2 text-gray-300" />
        <p className="text-sm">Tidak ada data riwayat ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-4">No. Booking</th>
            <th className="px-6 py-4">Klien</th>
            <th className="px-6 py-4">Tanggal Shoot</th>
            <th className="px-6 py-4">Paket</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-slate-50/80 transition-colors group"
            >
              <td className="px-6 py-4">
                <span className="font-mono font-medium text-slate-700 text-sm">
                  #{item.bookingNumber}
                </span>
                <p className="text-[10px] text-gray-400 md:hidden">
                  {formatDate(item.createdAt)}
                </p>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-800">
                {item.client.clientName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {item.schedule ? formatDate(item.schedule.tanggalBooking) : "-"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {item.layanan.nama}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-slate-700">
                {formatRupiah(item.pricing.totalAmount)}
              </td>
              <td className="px-6 py-4 text-center">
                {getStatusBadge(item.status)}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end items-center gap-2">
                  {item.folder && item.folder.path && (
                    <a
                      href={item.folder.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Buka Google Drive"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </a>
                  )}
                  <Link
                    href={`/dashboard/booking/${item.id}`}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" /> Detail
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
