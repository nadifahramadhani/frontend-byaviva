"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Save,
  Loader2,
  XCircle,
  Banknote,
  Clock,
  Briefcase,
  Check,
} from "lucide-react";
import axiosInstance from "@/lib/axios";

interface Props {
  bookingId: number;
  currentStatus: string;
  onUpdateSuccess: () => void;
  onCancel?: () => void; // Tambah prop untuk tombol batal
}

// CONFIG: Label, Warna, dan Icon untuk setiap Status
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any; desc: string }
> = {
  waiting_payment: {
    label: "Menunggu Pembayaran",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock,
    desc: "Client belum upload bukti bayar",
  },
  waiting_confirmation: {
    label: "Verifikasi Pembayaran",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Banknote,
    desc: "Cek mutasi rekening admin",
  },
  dp_paid: {
    label: "DP Lunas",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    icon: CheckCircle2,
    desc: "Uang DP diterima. Folder GDrive otomatis dibuat.",
  },
  in_progress: {
    label: "Sedang Dikerjakan",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Briefcase,
    desc: "Proses pemotretan/editing berlangsung",
  },
  waiting_final: {
    label: "Menunggu Pelunasan",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: Clock,
    desc: "Menagih sisa pembayaran ke client",
  },
  paid: {
    label: "Lunas (Full)",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: Banknote,
    desc: "Seluruh pembayaran telah selesai",
  },
  completed: {
    label: "Selesai",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle2,
    desc: "Project selesai sepenuhnya",
  },
  canceled: {
    label: "Dibatalkan",
    color: "bg-red-50 text-red-600 border-red-200",
    icon: XCircle,
    desc: "Booking hangus/batal",
  },
  rejected: {
    label: "Ditolak",
    color: "bg-red-50 text-red-600 border-red-200",
    icon: XCircle,
    desc: "Pembayaran tidak valid",
  },
};

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  waiting_payment: ["dp_paid", "canceled", "rejected"],
  waiting_confirmation: ["dp_paid", "canceled", "rejected"],
  dp_paid: ["in_progress", "paid", "canceled"],
  in_progress: ["waiting_final", "paid", "canceled"],
  waiting_final: ["paid", "canceled"],
  paid: ["completed", "in_progress", "canceled"],
  completed: [],
  canceled: [],
  rejected: [],
};

export const BookingStatusActions = ({
  bookingId,
  currentStatus,
  onUpdateSuccess,
  onCancel,
}: Props) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const availableNextStatuses = ALLOWED_TRANSITIONS[currentStatus] || [];
  const currentConfig = STATUS_CONFIG[currentStatus] || {
    label: currentStatus,
    color: "bg-gray-100",
    icon: Clock,
    desc: "",
  };

  const handleUpdate = async () => {
    if (!selectedStatus) return;
    try {
      setLoading(true);
      await axiosInstance.patch(`/booking/${bookingId}/status`, {
        status: selectedStatus,
        catatan: note || undefined,
      });
      onUpdateSuccess();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal update status");
    } finally {
      setLoading(false);
    }
  };

  if (availableNextStatuses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-bold text-gray-700">Status Final</h3>
        <p className="text-sm text-gray-500 mt-1">
          Booking ini sudah selesai diproses.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. VISUAL FLOW: FROM -> TO */}
      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Status Sekarang
          </p>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${currentConfig.color}`}
          >
            <currentConfig.icon size={12} />
            {currentConfig.label}
          </div>
        </div>
        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border border-slate-200 shadow-sm shrink-0">
          <ArrowRight size={14} className="text-slate-400" />
        </div>
        <div className="flex-1 text-right">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Akan Diubah Ke
          </p>
          {selectedStatus ? (
            <span
              className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${STATUS_CONFIG[selectedStatus].color}`}
            >
              {STATUS_CONFIG[selectedStatus].label}
            </span>
          ) : (
            <span className="text-xs text-slate-400 italic">
              Pilih status...
            </span>
          )}
        </div>
      </div>

      {/* 2. PILIHAN STATUS (CARD STYLE) */}
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-3">
          Pilih Status Selanjutnya
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableNextStatuses.map((statusKey) => {
            const config = STATUS_CONFIG[statusKey];
            const isSelected = selectedStatus === statusKey;

            return (
              <div
                key={statusKey}
                onClick={() => setSelectedStatus(statusKey)}
                className={`
                  relative cursor-pointer rounded-xl p-3 border-2 transition-all duration-200
                  ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 shadow-sm"
                      : "border-gray-100 bg-white hover:border-blue-200 hover:bg-slate-50"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Icon Wrapper */}
                  <div
                    className={`
                    p-2 rounded-lg shrink-0
                    ${
                      isSelected
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }
                  `}
                  >
                    <config.icon size={18} />
                  </div>

                  <div>
                    <p
                      className={`text-sm font-bold ${
                        isSelected ? "text-blue-700" : "text-slate-700"
                      }`}
                    >
                      {config.label}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                      {config.desc}
                    </p>
                  </div>

                  {/* Checkmark Absolute */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 text-blue-600">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. INFO ALERT (Jika DP Paid dipilih) */}
      {selectedStatus === "dp_paid" && (
        <div className="flex gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800">
            <p className="font-bold mb-1">System Automation:</p>
            <p>
              Sistem akan otomatis membuat <strong>Folder Google Drive</strong>{" "}
              dan <strong>Database Folder</strong> untuk booking ini setelah
              disimpan.
            </p>
          </div>
        </div>
      )}

      {/* 4. CATATAN & TOMBOL */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Catatan Perubahan (Opsional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tulis alasan perubahan status atau info pembayaran..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all min-h-[80px] resize-none"
          />
        </div>

        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-3 bg-white border border-gray-300 text-slate-600 font-bold rounded-xl text-sm hover:bg-gray-50 transition"
            >
              Batal
            </button>
          )}
          <button
            onClick={handleUpdate}
            disabled={!selectedStatus || loading}
            className={`flex-[2] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
              !selectedStatus || loading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
