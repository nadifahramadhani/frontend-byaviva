import React from "react";
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  CalendarClock,
  User,
  ArrowRight, // Icon baru
  CheckCircle, // Icon baru
  XCircle, // Icon baru
  MessageSquare, // Icon baru
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/format-utils";

// --- Sub-Card: Paket ---
export const PackageCard = ({
  layanan,
  konsep,
}: {
  layanan: any;
  konsep: any;
}) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <h2 className="flex items-center gap-2 font-bold text-lg text-slate-800 mb-4 border-b pb-2">
      <FileText className="w-5 h-5 text-orange-500" /> Paket & Konsep
    </h2>
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
          Layanan
        </p>
        <p className="font-bold text-slate-800 text-lg">{layanan.nama}</p>
        <p className="text-sm text-gray-500 mt-1">{layanan.deskripsi}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
          Konsep
        </p>
        <p className="font-bold text-slate-800 text-lg">{konsep.judul}</p>
        <p className="text-sm text-gray-500 mt-1">{konsep.deskripsi}</p>
      </div>
    </div>
  </div>
);

// --- Sub-Card: Jadwal ---
export const ScheduleCard = ({
  schedule,
  lokasi,
  status,
  onReschedule,
}: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4 border-b pb-2">
      <h2 className="flex items-center gap-2 font-bold text-lg text-slate-800">
        <Calendar className="w-5 h-5 text-blue-500" /> Jadwal & Lokasi
      </h2>
      {status !== "completed" && status !== "cancelled" && (
        <button
          onClick={onReschedule}
          className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <CalendarClock className="w-4 h-4" /> Ajukan Reschedule
        </button>
      )}
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-700">Tanggal</p>
            <p className="text-slate-800">
              {formatDate(schedule?.tanggalBooking)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-700">Waktu</p>
            <p className="text-slate-800">
              {formatTime(schedule?.startTime)} -{" "}
              {formatTime(schedule?.endTime)} WIB
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
        <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-gray-700">Lokasi Shoot</p>
          <p className="text-slate-800 font-medium">
            {lokasi?.lokasi || "Belum ditentukan"}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// --- Sub-Card: Client ---
export const ClientCard = ({ client }: { client: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <h2 className="flex items-center gap-2 font-bold text-lg text-slate-800 mb-4 border-b pb-2">
      <User className="w-5 h-5 text-purple-500" /> Informasi Klien
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="text-xs text-gray-400">Nama</p>
        <p className="font-medium text-slate-800">{client.clientName}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400">No. HP</p>
        <p className="font-medium text-slate-800">{client.clientPhone}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400">Email</p>
        <p className="font-medium text-slate-800">{client.clientEmail}</p>
      </div>
    </div>
  </div>
);

// --- [BARU] Sub-Card: Review Reschedule ---
export const RescheduleReviewCard = ({
  oldSchedule,
  newDate,
  reason,
  status,
  onApprove,
  onReject,
  isLoading,
}: {
  oldSchedule: any;
  newDate: string;
  reason: string;
  status: string;
  onApprove: () => void;
  onReject: () => void;
  isLoading: boolean;
}) => {
  // --- PERBAIKAN DISINI ---
  const isPending = status === "pending";
  const isApproved = status === "approved";
  const isRejected = status === "rejected"; // Ganti nama variabel duplicate tadi

  return (
    <div
      className={`bg-white p-0 rounded-2xl border shadow-sm overflow-hidden relative ${
        isPending
          ? "border-orange-200"
          : isApproved
          ? "border-green-200"
          : "border-red-200"
      }`}
    >
      {/* Accent Line berubah warna sesuai status */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${
          isPending
            ? "bg-orange-500"
            : isApproved
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      ></div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="flex items-center gap-2 font-bold text-lg text-slate-800">
            <CalendarClock
              className={`w-6 h-6 ${
                isPending ? "text-orange-500" : "text-slate-400"
              }`}
            />
            Tinjauan Reschedule
          </h2>

          {/* Badge Status di Pojok Kanan */}
          {!isPending && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                isApproved
                  ? "bg-green-50 text-green-600 border-green-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              {status}
            </span>
          )}
        </div>

        {/* Comparison Grid */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          {/* JADWAL LAMA */}
          <div className="flex-1 w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">
              Jadwal Lama
            </p>
            <div className="flex items-center gap-2 text-slate-500 line-through decoration-red-400 decoration-2">
              <Calendar className="w-4 h-4" />
              <span className="font-semibold text-lg">
                {formatDate(oldSchedule?.tanggalBooking)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 shrink-0">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* JADWAL BARU */}
          <div
            className={`flex-1 w-full p-4 rounded-xl border ${
              isApproved
                ? "bg-green-50 border-green-200"
                : "bg-orange-50 border-orange-100"
            }`}
          >
            <p
              className={`text-xs font-bold uppercase mb-2 ${
                isApproved ? "text-green-600" : "text-orange-600"
              }`}
            >
              Jadwal Baru (Diajukan)
            </p>
            <div className="flex items-center gap-2 text-slate-800">
              <Calendar
                className={`w-4 h-4 ${
                  isApproved ? "text-green-500" : "text-orange-500"
                }`}
              />
              <span className="font-bold text-lg text-slate-900">
                {formatDate(newDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Reason Section */}
        <div className="bg-slate-50 p-4 rounded-xl mb-6">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                Alasan Client
              </p>
              <p className="text-slate-700 italic">"{reason}"</p>
            </div>
          </div>
        </div>

        {/* LOGIKA KONDISIONAL TOMBOL */}
        {isPending ? (
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={onApprove}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-70"
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              Setujui Perubahan
            </button>

            <button
              onClick={onReject}
              disabled={isLoading}
              className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
            >
              <XCircle className="w-5 h-5" />
              Tolak
            </button>
          </div>
        ) : (
          /* Tampilan jika sudah diproses (Tombol hilang, ganti info) */
          <div
            className={`flex items-center justify-center gap-2 p-4 rounded-xl border font-bold text-sm ${
              isApproved
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {isApproved ? <CheckCircle size={18} /> : <XCircle size={18} />}
            Permintaan ini telah di-{isApproved ? "SETUJUI" : "TOLAK"}.
          </div>
        )}
      </div>
    </div>
  );
};
