"use client";

import React, { useState } from "react";
import {
  Wallet,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  X,
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/format-utils";
// 👇 IMPORT MODAL INVOICE
import { InvoiceModal } from "@/components/booking/detail/InvoiceModal";

interface Props {
  // 👇 DATA WAJIB BARU UNTUK INVOICE
  bookingId: number;
  clientName: string;
  packageName?: string;

  pricing: any;
  pembayaran: any[];
  status: string;
  role?: "user" | "admin";
  onPayClick?: () => void;
  // onInvoiceClick kita hapus/opsional karena sekarang ditangani internal modal
  onVerifyPayment?: (id: number, status: "paid" | "rejected") => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const BookingFinancials = ({
  bookingId,
  clientName,
  packageName,
  pricing,
  pembayaran,
  status,
  role = "user",
  onPayClick,
  onVerifyPayment,
}: Props) => {
  const isAdmin = role === "admin";

  // State untuk Modal Gambar Bukti Bayar
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 👇 INI YANG TADINYA HILANG (FIX ERROR ReferenceError)
  const [showInvoice, setShowInvoice] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
        {/* HEADER */}
        <div className="bg-slate-50 p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="flex items-center gap-2 font-bold text-lg text-slate-800">
            <Wallet className="w-5 h-5 text-green-600" /> Keuangan
          </h2>
          {/* Tombol Invoice Header */}
          <button
            onClick={() => setShowInvoice(true)} // ✅ Sekarang aman
            className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors"
          >
            <FileText className="w-3 h-3" /> Invoice
          </button>
        </div>

        <div className="p-6 flex flex-col">
          {/* RINCIAN TAGIHAN */}
          <div className="space-y-3 pb-6 border-b border-dashed border-gray-300">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Rincian Tagihan
            </p>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Paket Layanan</span>
              <span>{formatRupiah(pricing.layananPrice)}</span>
            </div>
            {pricing.konsepPrice > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Add-on Konsep</span>
                <span>{formatRupiah(pricing.konsepPrice)}</span>
              </div>
            )}
            {pricing.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Diskon</span>
                <span>- {formatRupiah(pricing.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg text-slate-900 pt-2 border-t border-gray-100 mt-2">
              <span>Total</span>
              <span>{formatRupiah(pricing.totalAmount)}</span>
            </div>
          </div>

          {/* RIWAYAT PEMBAYARAN */}
          <div className="pt-6 space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Riwayat Pembayaran
            </p>
            {pembayaran.length === 0 ? (
              <div className="text-center py-4 bg-gray-50 rounded-lg text-sm text-gray-400 italic">
                Belum ada pembayaran masuk.
              </div>
            ) : (
              pembayaran.map((pay) => (
                <div
                  key={pay.id}
                  className={`flex flex-col text-sm p-3 bg-gray-50 rounded-lg border ${
                    isAdmin && pay.status === "waiting_confirmation"
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-slate-700">{pay.tipe}</p>
                      <p className="text-[10px] text-gray-500">
                        {formatDate(pay.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">
                        {formatRupiah(pay.jumlah)}
                      </p>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          pay.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : pay.status === "waiting_confirmation"
                            ? "bg-blue-100 text-blue-700"
                            : pay.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {pay.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {pay.buktiBayarUrl && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200/50">
                      <button
                        onClick={() =>
                          setPreviewImage(`${API_BASE_URL}${pay.buktiBayarUrl}`)
                        }
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> Lihat Bukti
                      </button>

                      {isAdmin &&
                        pay.status === "waiting_confirmation" &&
                        onVerifyPayment && (
                          <div className="ml-auto flex gap-2">
                            <button
                              onClick={() =>
                                onVerifyPayment(pay.id, "rejected")
                              }
                              className="px-2 py-1 bg-white border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-50 transition flex items-center gap-1"
                              title="Tolak Pembayaran"
                            >
                              <XCircle className="w-3 h-3" /> Tolak
                            </button>
                            <button
                              onClick={() => onVerifyPayment(pay.id, "paid")}
                              className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition flex items-center gap-1 shadow-sm"
                              title="Verifikasi Valid"
                            >
                              <CheckCircle className="w-3 h-3" /> Valid
                            </button>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-slate-50 border-t border-gray-200 flex flex-col gap-3">
          {/* Tombol Invoice Footer */}
          <button
            onClick={() => setShowInvoice(true)} // ✅ Sekarang aman
            className="w-full bg-white border border-gray-300 text-slate-700 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm flex justify-center items-center gap-2 text-sm"
          >
            <FileText className="w-4 h-4" /> Lihat Invoice
          </button>

          {!isAdmin && status === "waiting_payment" && onPayClick && (
            <button
              onClick={onPayClick}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex justify-center items-center gap-2 text-sm"
            >
              <CreditCard className="w-4 h-4" /> Upload Pembayaran
            </button>
          )}
        </div>
      </div>

      {/* --- MODAL IMAGE PREVIEW --- */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative bg-white p-2 rounded-xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Bukti Pembayaran"
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* --- MODAL INVOICE --- */}
      {showInvoice && (
        <InvoiceModal
          bookingId={bookingId}
          clientName={clientName}
          packageName={packageName}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </>
  );
};
