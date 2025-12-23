"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, User, FileText, MapPin } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { RescheduleReviewCard } from "@/components/booking/detail/BookingInfoCards";
import { formatDate } from "@/lib/format-utils";

export default function RescheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rescheduleId = Number(params.id);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  // --- 1. FETCH DATA RESCHEDULE ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/reschedule/${rescheduleId}`);

        // DEBUGGING: Cek isi respon di console browser (F12)
        console.log("Respon API Reschedule:", res.data);

        // PERBAIKAN: Handle jika data dibungkus property 'data'
        // Jika res.data punya property .data lagi, ambil dalamnya. Jika tidak, ambil res.data langsung.
        const actualData = res.data.data ? res.data.data : res.data;

        setData(actualData);
      } catch (error) {
        console.error("Gagal ambil data:", error);
        alert("Data reschedule tidak ditemukan.");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    if (rescheduleId) fetchData();
  }, [rescheduleId]);
  // --- 2. ACTION HANDLER ---
  const handleAction = async (action: "approved" | "rejected") => {
    const confirmMsg =
      action === "approved"
        ? "Setujui perubahan jadwal ini? Jadwal booking akan otomatis diperbarui."
        : "Tolak pengajuan reschedule ini?";

    if (!confirm(confirmMsg)) return;

    try {
      setActionLoading(true);

      // PERBAIKAN DISINI: Tambahkan object { status: action } sebagai argumen kedua
      await axiosInstance.patch(`/reschedule/${rescheduleId}/update`, {
        status: action, // <--- Ini wajib dikirim agar backend menerima "approved" atau "rejected"
      });

      alert(`Berhasil di-${action === "approved" ? "setujui" : "tolak"}`);
      router.push("/admin/booking");
    } catch (error: any) {
      console.error(error); // Debugging: biar kelihatan error aslinya di console
      alert(error.response?.data?.message || "Gagal memproses aksi");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#F0F8FF] p-6 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* HEADER & BACK BUTTON */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Review Reschedule
            </h1>
            <p className="text-sm text-slate-500">
              Permintaan perubahan jadwal oleh client
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KOLOM KIRI: KARTU REVIEW UTAMA */}

          <div className="md:col-span-2 space-y-6">
            <RescheduleReviewCard
              oldSchedule={{ tanggalBooking: data.oldDate }}
              newDate={data.newDate}
              reason={data.alasan}
              status={data.status} // [PENTING] Kirim status ke komponen
              isLoading={actionLoading}
              onApprove={() => handleAction("approved")}
              onReject={() => handleAction("rejected")}
            />
          </div>

          {/* KOLOM KANAN: KONTEKS BOOKING (INFO TAMBAHAN) */}
          <div className="space-y-6">
            {/* Info Client */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <User size={18} className="text-purple-500" /> Client
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Nama</p>
                  <p className="font-medium text-slate-700">
                    {data.booking?.client?.clientName || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">No. Booking</p>
                  <p className="font-mono text-slate-600 bg-gray-100 px-2 py-1 rounded w-fit text-xs mt-1">
                    {data.booking?.bookingNumber || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Paket (Konteks) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-blue-500" /> Detail Paket
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Layanan</p>
                  <p className="font-medium text-slate-700">
                    {data.booking?.layanan?.nama || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Lokasi Asal</p>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin size={14} className="text-red-400 mt-0.5" />
                    <p className="text-slate-600 leading-tight">
                      {data.booking?.lokasi?.lokasi || "Belum ditentukan"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
