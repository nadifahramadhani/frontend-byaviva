"use client";

import React, { useEffect, useState } from "react";
import { X, Printer, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { formatRupiah, formatDate } from "@/lib/format-utils";

interface InvoiceData {
  bookingId: number;
  bookingNumber: string;
  status: string;
  details: {
    totalTagihan: number;
    dpHarusDibayar: number;
    sisaPelunasan: number;
    deadlinePembayaran: string;
  };
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

interface Props {
  bookingId: number;
  clientName: string;
  packageName?: string;
  onClose: () => void;
}

export const InvoiceModal = ({
  bookingId,
  clientName,
  packageName,
  onClose,
}: Props) => {
  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axiosInstance.get(`/payments/bill-info/${bookingId}`);
        setData(res.data);
      } catch (error) {
        console.error("Gagal load invoice", error);
        alert("Gagal memuat data invoice");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-xl flex items-center gap-3 shadow-lg">
          <Loader2 className="animate-spin text-slate-600" />
          <span className="text-slate-600 font-semibold text-sm">
            Memuat Invoice...
          </span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    // 1. Container Luar: Padding diperkecil (p-4), backdrop tetap
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 print:p-0 print:bg-white">
      {/* 2. Box Modal: 
          - max-w-2xl (Lebih ramping, mirip A4)
          - max-h-[90vh] (Agar tidak bablas ke bawah layar)
          - overflow-y-auto (Scrollable jika konten panjang) 
      */}
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative flex flex-col print:shadow-none print:max-w-none print:max-h-none print:rounded-none print:overflow-visible">
        {/* HEADER AKSI (Sticky di atas saat scroll) */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b bg-gray-50/95 backdrop-blur shadow-sm print:hidden">
          <h2 className="font-bold text-base text-slate-700">
            Preview Invoice
          </h2>
          <div className="flex gap-2">
            {/* <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded-md text-xs font-bold hover:bg-slate-900 transition shadow-sm"
            >
              <Printer size={14} /> Cetak PDF
            </button> */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 rounded-full transition text-gray-500"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* KONTEN INVOICE (Padding dikurangi biar muat) */}
        <div className="p-8 md:p-10 text-slate-800 print:p-0" id="invoice-area">
          {/* Header Invoice */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1E3A5F] tracking-tight">
                BYAVIVA
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Professional Photography Studio
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-200 uppercase tracking-widest leading-none">
                INVOICE
              </h2>
              <p className="text-sm font-bold text-slate-700 mt-1">
                #{data.bookingNumber}
              </p>
              <p className="text-[10px] text-gray-400">
                {formatDate(new Date().toISOString())}
              </p>
            </div>
          </div>

          {/* Info Client & Status */}
          <div className="flex justify-between mb-8 border-t border-b border-gray-100 py-5">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Ditagihkan Kepada:
              </p>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">
                {clientName}
              </h3>
              {packageName && (
                <p className="text-xs text-gray-600 mt-1">{packageName}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Status Pembayaran:
              </p>
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  data.status === "paid"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : data.status === "dp_paid"
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-yellow-100 text-yellow-700 border-yellow-200"
                }`}
              >
                {data.status.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Tabel Rincian */}
          <div className="mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800">
                  <th className="py-2 text-xs font-bold uppercase text-slate-600 w-1/2">
                    Deskripsi
                  </th>
                  <th className="py-2 text-xs font-bold uppercase text-slate-600 text-right">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="py-3 font-semibold text-slate-700">
                    Total Paket Layanan
                  </td>
                  <td className="py-3 text-right font-bold text-slate-700">
                    {formatRupiah(data.details.totalTagihan)}
                  </td>
                </tr>
              </tbody>
              <tfoot className="text-sm">
                <tr>
                  <td className="pt-3 text-xs text-slate-500">
                    Down Payment (DP) Wajib
                  </td>
                  <td className="pt-3 text-right text-xs text-slate-500">
                    {formatRupiah(data.details.dpHarusDibayar)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 text-xs text-slate-500">
                    Sisa Pelunasan
                  </td>
                  <td className="py-1 text-right font-bold text-red-600 text-sm">
                    {formatRupiah(data.details.sisaPelunasan)}
                  </td>
                </tr>
                <tr className="text-base">
                  <td className="pt-3 font-bold text-slate-800">
                    Total Tagihan
                  </td>
                  <td className="pt-3 text-right font-bold text-slate-900">
                    {formatRupiah(data.details.totalTagihan)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Info Bank Transfer */}
          <div className="bg-slate-50 p-4 rounded-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Metode Pembayaran
              </p>
              <div className="flex items-center gap-3">
                <div className="font-bold text-slate-800 text-base">
                  {data.bankInfo.bankName}
                </div>
                <div className="h-3 w-[1px] bg-gray-300"></div>
                <div>
                  <p className="font-mono text-slate-700 font-semibold text-sm">
                    {data.bankInfo.accountNumber}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">
                    A.N {data.bankInfo.accountName}
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-0.5">
                Jatuh Tempo
              </p>
              <p className="text-sm font-bold text-slate-700">
                {formatDate(data.details.deadlinePembayaran)}
              </p>
            </div> */}
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-gray-200 text-center text-[10px] text-gray-400">
            <p>
              Terima kasih telah mempercayakan momen Anda kepada Byaviva Studio.
            </p>
            <p className="mt-0.5">
              Bukti pembayaran harap diupload melalui dashboard user.
            </p>
          </div>
        </div>
      </div>

      {/* CSS KHUSUS PRINT */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0; /* Margin nol karena kita atur lewat padding div */
          }

          body * {
            visibility: hidden;
            background: white !important;
          }

          #invoice-area,
          #invoice-area * {
            visibility: visible;
          }

          #invoice-area {
            position: fixed;
            left: 0;
            top: 0;
            width: 100% !important;
            height: auto !important;

            /* RESET STYLE MODAL */
            max-width: none !important;
            max-height: none !important;
            overflow: visible !important;

            margin: 0 !important;
            /* 👇 UBAH INI: Perkecil padding kertas jadi 1.5cm biar muat */
            padding: 1.5cm !important;

            background: white !important;
            z-index: 9999;
          }

          /* 👇 TRIK BARU: Perkecil jarak vertikal (margin) saat print */
          #invoice-area .mb-8,
          #invoice-area .mb-10 {
            margin-bottom: 1.5rem !important; /* Paksa jarak lebih rapat (sekitar 24px) */
          }

          #invoice-area .mt-10,
          #invoice-area .mt-12 {
            margin-top: 1.5rem !important; /* Paksa jarak footer lebih rapat */
          }

          /* Sembunyikan tombol header modal */
          button {
            display: none !important;
          }

          /* Sembunyikan Header Sticky modal */
          .sticky {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
