"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link"; // <--- 1. Import Link

interface BookingCardProps {
  id: string; // Ini untuk tampilan (misal: SHTBVV...)
  numericId: number; // <--- 2. Tambah ini untuk URL (misal: 5)
  packageName: string;
  date: string;
  price: string;
  status: "Waiting" | "Upcoming" | "Completed" | "Cancelled";
}

export const BookingCard = ({
  id,
  numericId, // <--- 3. Terima props ini
  packageName,
  date,
  price,
  status,
}: BookingCardProps) => {
  const statusStyles = {
    Waiting: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Upcoming: "bg-blue-100 text-blue-800 border-blue-200",
    Completed: "bg-green-100 text-green-800 border-green-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    // 4. Bungkus Card dengan Link mengarah ke numericId
    <Link href={`/dashboard/booking/${numericId}`} className="block h-full">
      <div className="flex flex-col p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all w-full h-full relative group cursor-pointer hover:border-orange-200">
        {/* Header Card */}
        <div className="flex justify-between items-start mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[status]}`}
          >
            {status}
          </span>
          <span className="text-xs text-gray-400 font-mono tracking-wide">
            #{id}
          </span>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {packageName}
          </h3>
          <p className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            📅 {date}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-4">
          <span className="font-bold text-slate-800 text-lg">{price}</span>
          <button className="flex items-center gap-1 text-sm font-bold text-gray-500 group-hover:text-orange-600 transition-colors">
            Detail
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};
