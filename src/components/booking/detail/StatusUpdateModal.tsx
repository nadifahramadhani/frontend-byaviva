"use client";

import React from "react";
import { X } from "lucide-react";
import { BookingStatusActions } from "@/components/booking/detail/BookingStatusActions";

interface Props {
  bookingId: number;
  currentStatus: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const StatusUpdateModal = ({
  bookingId,
  currentStatus,
  onClose,
  onSuccess,
}: Props) => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose} // Klik luar untuk tutup
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Cegah tutup saat klik isi modal
      >
        {/* Header Sederhana */}
        <div className="flex justify-between items-center px-6 pt-6 pb-2">
          <div>
            <h3 className="font-bold text-xl text-slate-800">Update Status</h3>
            <p className="text-xs text-slate-500 mt-1">
              Pilih status terbaru untuk booking ini
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <BookingStatusActions
            bookingId={bookingId}
            currentStatus={currentStatus}
            onCancel={onClose} // Pass fungsi close ke tombol batal
            onUpdateSuccess={() => {
              onSuccess();
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
