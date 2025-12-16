"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useBooking } from "@/context/BookingContext";
import Link from "next/link";

interface PaymentSuccessProps {
  bookingId: number;
}

export default function PaymentSuccess({ bookingId }: PaymentSuccessProps) {
  const { data: bookingData } = useBooking(); // Ambil data inputan user dari Context untuk Info Book
  const [billInfo, setBillInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Ambil Data Keuangan Real dari Backend (bill-info)
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `http://localhost:3000/api/payments/bill-info/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBillInfo(res.data);
      } catch (err) {
        console.error("Gagal ambil bill info", err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBill();
  }, [bookingId]);

  // Helper Format Rupiah
  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  // Helper Format Tanggal
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading)
    return <div className="text-center py-10">Memuat Detail Pesanan...</div>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-10">
      {/* --- HEADER --- */}
      <div className="text-center mb-8">
        <div className="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Thank You!</h2>
        <p className="text-slate-600 font-medium text-lg">
          Your Shoot Successfully Booked
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Bukti pembayaran DP Anda sedang diverifikasi admin.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* --- BAGIAN 1: BOOK DETAIL (KEUANGAN) --- */}
        <div className="p-8 border-b border-gray-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Book Detail :
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">Book Number</span>
              <span className="font-bold text-blue-600 font-mono tracking-wider">
                {billInfo?.bookingNumber || `#${bookingId}`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">Total Tagihan</span>
              <span className="font-bold text-slate-800">
                {billInfo ? formatRupiah(billInfo.details.totalTagihan) : "-"}
              </span>
            </div>

            {/* <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg -mx-3">
              <span className="font-semibold text-green-700">
                Pembayaran DP (Upload)
              </span>
              <span className="font-bold text-green-700">
                {billInfo ? formatRupiah(billInfo.details.dpHarusDibayar) : "-"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">
                Sisa Pembayaran
              </span>
              <span className="font-bold text-orange-600">
                {billInfo ? formatRupiah(billInfo.details.sisaPelunasan) : "-"}
              </span>
            </div> */}
          </div>
        </div>

        {/* --- BAGIAN 2: INFO BOOK (LOGISTIK) --- */}
        <div className="p-8 bg-gray-50/50">
          <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">
            Info Book :
          </h3>

          <div className="grid grid-cols-[140px_1fr] gap-y-4 text-sm">
            <div className="text-gray-500 font-medium">
              Tanggal Booking Dibuat
            </div>
            <div className="font-bold text-slate-800">
              {formatDate(billInfo?.createdAt || new Date().toISOString())}
            </div>

            <div className="text-gray-500 font-medium">Nama Client</div>
            <div className="font-bold text-slate-800 capitalize">
              {bookingData.clientName}
            </div>

            {/* <div className="text-gray-500 font-medium">Kategori</div>
            <div className="font-bold text-slate-800">Prewedding (Contoh)</div> */}

            <div className="text-gray-500 font-medium">Paket Foto</div>
            <div className="font-bold text-slate-800">
              {bookingData.conceptName}
            </div>

            <div className="text-gray-500 font-medium">Konsep Foto</div>
            <div className="font-bold text-slate-800">
              {bookingData.packageName || "-"}
            </div>

            <div className="text-gray-500 font-medium">Jadwal Shoot</div>
            <div className="font-bold text-slate-800">
              {formatDate(bookingData.shootDate)}{" "}
              <span className="text-gray-400">|</span> {bookingData.shootTime}
            </div>

            {bookingData.discussion1Date && (
              <>
                <div className="text-gray-500 font-medium">Diskusi 1</div>
                <div className="font-bold text-slate-800">
                  {formatDate(bookingData.discussion1Date)}{" "}
                  <span className="text-gray-400">|</span>{" "}
                  {bookingData.discussion1Time}
                </div>
              </>
            )}
            {bookingData.discussion2Date && (
              <>
                <div className="text-gray-500 font-medium">Diskusi 2</div>
                <div className="font-bold text-slate-800">
                  {formatDate(bookingData.discussion2Date)}{" "}
                  <span className="text-gray-400">|</span>{" "}
                  {bookingData.discussion2Time}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- TOMBOL AKSI --- */}
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/dashboard"
          className="px-8 py-3 rounded-full bg-slate-800 text-white font-bold hover:bg-slate-700 transition shadow-lg"
        >
          Ke Dashboard Saya
        </Link>
        <Link
          href="/"
          className="px-8 py-3 rounded-full bg-white text-slate-700 border border-slate-200 font-bold hover:bg-gray-50 transition"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
}
