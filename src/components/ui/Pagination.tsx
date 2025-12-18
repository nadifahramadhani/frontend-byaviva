"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination = ({ page, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null; // Sembunyikan jika cuma 1 halaman

  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
      <p className="text-xs text-gray-500 font-medium">
        Halaman <span className="font-bold text-gray-800">{page}</span> dari{" "}
        {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors shadow-sm"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};
