"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import {
  Loader2,
  AlertCircle,
  Activity,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/format-utils";

// --- IMPORT KOMPONEN ---
import { BookingHeader } from "@/components/booking/detail/BookingHeader";
import { BookingFinancials } from "@/components/booking/detail/BookingFinancials";
import {
  PackageCard,
  ScheduleCard,
  ClientCard,
} from "@/components/booking/detail/BookingInfoCards";

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = Number(params.id);

  const [booking, setBooking] = useState<any>(null);
  const [rescheduleLogs, setRescheduleLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // --- 1. FETCH DATA ---
  const refreshData = async () => {
    if (!bookingId) return;
    try {
      const [resBooking, resLogs] = await Promise.all([
        axiosInstance.get(`/booking/${bookingId}`),
        axiosInstance
          .get(`/reschedule/status/${bookingId}`)
          .catch(() => ({ data: [] })),
      ]);

      setBooking(resBooking.data);
      setRescheduleLogs(resLogs.data);
    } catch (err: any) {
      console.error("Error fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [bookingId]);

  // --- 2. HANDLE RESCHEDULE (Approve/Reject) ---
  const handleRescheduleAction = async (
    rescheduleId: number,
    action: "approved" | "rejected"
  ) => {
    if (!confirm(`Yakin ingin ${action} pengajuan ini?`)) return;
    setActionLoading(true);
    try {
      await axiosInstance.put(`/reschedule/${action}/${rescheduleId}`);
      await refreshData();
      alert("Status reschedule berhasil diperbarui.");
    } catch (error) {
      alert("Gagal memproses reschedule");
    } finally {
      setActionLoading(false);
    }
  };

  // --- 3. HANDLE VERIFIKASI PEMBAYARAN (Valid/Tolak) ---
  // Pastikan HANYA ADA SATU fungsi ini
  const handleVerifyPayment = async (
    paymentId: number,
    status: "paid" | "rejected"
  ) => {
    const message =
      status === "paid"
        ? "Yakin ingin memverifikasi pembayaran ini sebagai SAH (Paid)?\n\nSistem akan otomatis mengupdate status booking dan membuat folder."
        : "Yakin ingin MENOLAK bukti pembayaran ini?";

    if (!confirm(message)) return;

    setActionLoading(true);

    try {
      // Tembak API Verify Backend
      await axiosInstance.patch(`/payments/${paymentId}/verify`, {
        status: status,
      });

      await refreshData(); // Refresh data agar UI terupdate
      alert(
        `Pembayaran berhasil di-${status === "paid" ? "verifikasi" : "tolak"}`
      );
    } catch (error: any) {
      console.error("Gagal verifikasi:", error);
      alert(
        error.response?.data?.message || "Terjadi kesalahan saat verifikasi."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
      </div>
    );

  if (!booking)
    return <div className="p-10 text-center">Data tidak ditemukan</div>;

  const pendingReschedule = rescheduleLogs.find(
    (log) => log.status === "pending"
  );

  return (
    <div className="flex flex-col items-center w-full pb-20 bg-[#F0F8FF] min-h-screen">
      {/* HEADER AREA */}
      <div className="w-full bg-white border-b border-gray-200 pb-5 pt-4 px-6 mb-6">
        <div className="max-w-7xl mx-auto w-full">
          <BookingHeader
            bookingNumber={booking.bookingNumber}
            status={booking.status}
          />
        </div>
      </div>

      <div className="w-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI */}
        <div className="lg:col-span-2 space-y-6">
          {/* ALERT RESCHEDULE */}
          {pendingReschedule && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-orange-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg">
                    Permintaan Reschedule
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Client meminta ubah tanggal ke:{" "}
                    <b>{formatDate(pendingReschedule.newDate)}</b>
                  </p>
                  <p className="text-slate-600 text-sm italic mt-2">
                    "Alasan: {pendingReschedule.alasan}"
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      disabled={actionLoading}
                      onClick={() =>
                        handleRescheduleAction(pendingReschedule.id, "approved")
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle size={16} /> Setujui
                    </button>
                    <button
                      disabled={actionLoading}
                      onClick={() =>
                        handleRescheduleAction(pendingReschedule.id, "rejected")
                      }
                      className="px-4 py-2 bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-bold hover:bg-red-200 flex items-center gap-2 disabled:opacity-50"
                    >
                      <XCircle size={16} /> Tolak
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <PackageCard layanan={booking.layanan} konsep={booking.konsep} />

          <ScheduleCard
            schedule={booking.schedule}
            lokasi={booking.lokasi}
            status={booking.status}
            onReschedule={() =>
              alert(
                "Admin dapat mengedit jadwal lewat menu edit (Segera Hadir)"
              )
            }
          />

          <ClientCard client={booking.client} />
        </div>

        {/* KOLOM KANAN */}
        <div className="space-y-6">
          {/* FINANCIALS */}
          <BookingFinancials
            bookingId={booking.id}
            clientName={booking.client.clientName}
            packageName={booking.layanan.nama}
            pricing={booking.pricing}
            pembayaran={booking.pembayaran}
            status={booking.status}
            role="admin"
            onInvoiceClick={() =>
              window.open(`/invoice/${bookingId}`, "_blank")
            }
            onVerifyPayment={handleVerifyPayment} // Pass fungsi verifikasi kesini
          />

          {/* LOG AKTIVITAS */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="flex items-center gap-2 font-bold text-lg text-slate-800 mb-6">
              <Activity className="w-5 h-5 text-gray-500" /> Log Aktivitas
            </h2>
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
              {booking.logs?.map((log: any) => (
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
    </div>
  );
}
