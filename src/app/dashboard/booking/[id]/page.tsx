"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import {
  Loader2,
  ArrowLeft,
  History,
  AlertCircle,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate, formatTime } from "@/lib/format-utils";
import { PageHeaderCard } from "@/components/dashboard/PageHeaderCard";

// --- IMPORT KOMPONEN BARU KITA ---
import { BookingHeader } from "@/components/booking/detail/BookingHeader";
import {
  PackageCard,
  ScheduleCard,
  ClientCard,
} from "@/components/booking/detail/BookingInfoCards";
import { BookingFinancials } from "@/components/booking/detail/BookingFinancials";
import { RescheduleModal } from "@/components/booking/detail/RescheduleModal";
import { PaymentModalWrapper } from "@/components/booking/detail/PaymentModalWrapper";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = Number(params.id); // Pastikan number

  const [booking, setBooking] = useState<any>(null);
  const [rescheduleLogs, setRescheduleLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- STATE MODALS ---
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // --- FETCH DATA ---
  const refreshData = async () => {
    if (!bookingId) return;
    try {
      // Fetch Booking Detail & Reschedule Logs Paralel
      const [resBooking, resLogs] = await Promise.all([
        axiosInstance.get(`/booking/${bookingId}`),
        axiosInstance
          .get(`/reschedule/status/${bookingId}`)
          .catch(() => ({ data: [] })), // Handle error jika log kosong
      ]);

      setBooking(resBooking.data);
      setRescheduleLogs(resLogs.data);
    } catch (err: any) {
      console.error("Error fetch:", err);
      setError(err.response?.data?.message || "Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [bookingId]);

  // --- HANDLERS ---
  const handleSuccessAction = () => {
    setIsRescheduleOpen(false);
    setIsPaymentOpen(false);
    refreshData(); // Reload data otomatis
  };

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  if (error || !booking)
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center gap-4 text-red-500 font-medium">
        <p>{error || "Data tidak ditemukan"}</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center w-full">
      {/* 1. HEADER */}
      <div className="sticky top-[94px] z-50 w-full bg-foundation-primarylight pb-5 pt-2 transition-all">
        <div className="flex flex-col gap-2">
          {/* 1. Tombol Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors w-fit px-4 font-semibold text-sm"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>

          {/* 2. PageHeaderCard (Pengganti BookingHeader lama) */}
          <PageHeaderCard
            // Judul Utama: Nomor Booking
            title={`Booking #${booking.bookingNumber}`}
            // Subjudul: Status & Nama Client (atau info lain)
            subtitle={`Status: ${booking.status} | Client: ${
              booking.client?.clientName || "-"
            }`}
          />
        </div>
      </div>
      {/* 2. ALERT RESCHEDULE (Inline Component or Extract if complex) */}
      {rescheduleLogs.length > 0 && (
        <div className="w-full bg-orange-50 border-l-4 border-orange-500 rounded-r-xl p-5 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
            <div className="w-full space-y-4">
              <h3 className="text-lg font-bold text-slate-800">
                Status Pengajuan Reschedule
              </h3>
              {rescheduleLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white p-3 rounded-lg border border-orange-100 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs uppercase bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                      {log.newStatus}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 italic">
                    "{log.catatan}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI */}
        <div className="lg:col-span-2 space-y-8">
          <PackageCard layanan={booking.layanan} konsep={booking.konsep} />
          <ScheduleCard
            schedule={booking.schedule}
            lokasi={booking.lokasi}
            status={booking.status}
            onReschedule={() => setIsRescheduleOpen(true)}
          />
          <ClientCard client={booking.client} />
        </div>

        {/* KOLOM KANAN */}
        <div className="space-y-8">
          <BookingFinancials
            pricing={booking.pricing}
            pembayaran={booking.pembayaran}
            status={booking.status}
            onPayClick={() => setIsPaymentOpen(true)}
          />

          {/* LOG AKTIVITAS (Inline or Extract) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="flex items-center gap-2 font-bold text-lg text-slate-800 mb-6">
              <Activity className="w-5 h-5 text-gray-500" /> Log Aktivitas
            </h2>
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
              {booking.logs.map((log: any) => (
                <div key={log.id} className="ml-8 relative group">
                  <span className="absolute -left-[39px] top-1.5 w-4 h-4 bg-white rounded-full border-4 border-gray-300"></span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {log.newStatus.replace("_", " ").toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      {formatDate(log.createdAt)} • {formatTime(log.createdAt)}
                    </p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic border border-gray-100">
                      "{log.catatan}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODALS (Clean & Reusable) */}
      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        bookingId={bookingId}
        currentSchedule={booking.schedule}
        onSuccess={handleSuccessAction}
      />

      <PaymentModalWrapper
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        bookingId={bookingId}
        onSuccess={handleSuccessAction}
      />
    </div>
  );
}
